import PointListView from '../view/point-list-view.js';
import {SortType} from '../const/sort-const.js';
import SortView from '../view/sort-view.js';
import {render, remove} from '../framework/render.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import {sortPointByTime, sortPointByPrice, sortPointByDay} from '../utils/sort-utils.js';
import {UserAction, UpdateType} from '../const/point-const.js';
import {Filter, FilterType} from '../const/filter-const.js';
import NewPointPresenter from './new-point-presenter.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import LoadingView from '../view/loading-view.js';
import {RenderPosition} from '../render.js';
import TripInfoView from '../view/trip-info-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import FailedLoadingView from '../view/failed-loading-view.js';

const TimeLimit = {
  LOWER_LIMIT: 0,
  UPPER_LIMIT: 1000,
};

export default class TripPresenter {
  #pointsListComponent = new PointListView();
  #loadingComponent = new LoadingView();
  #failedLoadingComponent = new FailedLoadingView();
  #sortComponent = null;
  #tripInfoComponent = null;
  #currentSortType = SortType.DAY;
  #pointsContainer = null;
  #newPointButtonContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #isCreating = false;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #noPointsComponent = null;
  #filterModel = null;
  #filterType = FilterType.EVERYTHING;
  #newPointButtonComponent = null;
  #isLoading = true;
  #isFailed = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({pointsContainer, newPointButtonContainer, pointsModel, destinationsModel, offersModel, filterModel}) {
    this.#pointsContainer = pointsContainer;
    this.#newPointButtonContainer = newPointButtonContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#pointsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#newPointDestroyHandler ,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoint = Filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoint.sort(sortPointByTime);
      case SortType.PRICE:
        return filteredPoint.sort(sortPointByPrice);
      case SortType.DAY:
        return filteredPoint.sort(sortPointByDay);
    }
    return filteredPoint;
  }

  init() {
    this.#renderPointsContainer();
    this.#renderNewPointButton();
    this.#renderTrip();
  }

  #renderNewPointButton () {
    this.#newPointButtonComponent = new NewPointButtonView({
      onButtonClick: this.#buttonClickHandler,
    });
    render(this.#newPointButtonComponent, this.#newPointButtonContainer);
  }

  #renderTripInfo () {
    this.#tripInfoComponent = new TripInfoView({
      points: this.#pointsModel.points,
      destinations: this.#destinationsModel.get(),
      offersModel: this.#offersModel
    });
    render(this.#tripInfoComponent, this.#newPointButtonContainer, RenderPosition.AFTERBEGIN);
  }

  #buttonClickHandler = () => {
    this.#isCreating = true;
    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }
    this.createPoint();
    this.#newPointButtonComponent.setDisabled(true);
  };

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearTrip = ({resetSortType = false} = {}) => {
    this.#clearPoints();
    remove(this.#tripInfoComponent);
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    this.#sortComponent = null;

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
          this.#newPointPresenter.destroy();
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTrip();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFailedLoading();
        this.#isFailed = true;
        break;
    }
  };

  #renderFailedLoading() {
    render(this.#failedLoadingComponent, this.#pointsListComponent.element);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsContainer: this.#pointsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints = (points) => {
    points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #newPointDestroyHandler = () => {
    this.#isCreating = false;
    this.#newPointButtonComponent.setDisabled(false);
    if(this.points.length === 0) {
      this.#clearTrip();
      this.#renderTrip();
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderPoints(this.points);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#pointsContainer);
  };

  #renderPointsContainer = () => {
    render(this.#pointsListComponent, this.#pointsContainer);
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#pointsListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints = () => {
    this.#noPointsComponent = new NoPointView({filterType: this.#filterType});
    render(this.#noPointsComponent, this.#pointsListComponent.element);
  };

  #renderTrip = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      this.#newPointButtonComponent.setDisabled(true);
      return;
    }

    if(this.points.length === 0 && !this.#isLoading) {
      if(!this.#isCreating && !this.#isFailed){
        this.#renderNoPoints();
        this.#newPointButtonComponent.setDisabled(false);
      }
      return;
    }

    this.#renderTripInfo();
    this.#newPointButtonComponent.setDisabled(false);
    this.#renderSort();
    this.#renderPointsContainer();
    this.#renderPoints(this.points);
  };
}

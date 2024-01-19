import PointListView from '../view/point-list-view.js';
import {SortType} from '../const/sort-const.js';
import SortView from '../view/sort-view.js';
import {render, remove} from '../framework/render.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import {sortPointByTime, sortPointByPrice, sortPointByDay} from '../utils/sort-utils.js';
import {UserAction, UpdateType} from '../const/point-const.js';
import {filter, FilterType} from '../const/filter-const.js';
import NewPointPresenter from './new-point-presenter.js';
import NewPointButtonView from '../view/new-point-button-view.js';

export default class TripPresenter {
  #pointsListComponent = new PointListView();
  #sortComponent = null;
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
    const filteredPoint = filter[this.#filterType](points);

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
    this.#renderTrip();
    this.#newPointButtonComponent = new NewPointButtonView({
      onButtonClick: this.#buttonClickHandler,
    });
    render(this.#newPointButtonComponent, this.#newPointButtonContainer);
  }

  #buttonClickHandler = () => {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
    //this.createPoint();
    //newPointButtonComponent.element.disabled = true;
  };

  createPoint() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    this.#newPointPresenter.init();
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearTrip = ({resetSortType = false} = {}) => {
    this.#clearPoints();
    remove(this.#sortComponent);
    this.#sortComponent = null;

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    // В зависимости от типа изменений решаем, что делать:
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
    }
  };

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

  #renderNoPoints = () => {
    this.#noPointsComponent = new NoPointView({filterType: this.#filterType});
    render(this.#noPointsComponent, this.#pointsListComponent.element);
  };

  #renderTrip = () => {
    if(this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }
    this.#renderSort();
    this.#renderPointsContainer();
    this.#renderPoints(this.points);
  };
}

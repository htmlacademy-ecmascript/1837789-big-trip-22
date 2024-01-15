import PointListView from '../view/point-list-view.js';
import {SortType} from '../const/sort-const.js';
import SortView from '../view/sort-view.js';
import {render} from '../framework/render.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import {sortPointByTime, sortPointByPrice, sortPointByDay} from '../utils/sort-utils.js';
import {UserAction, UpdateType} from '../const/point-const.js';

export default class TripPresenter {
  #pointsListComponent = new PointListView();
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #pointsContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #points = [];

  #pointPresenters = new Map();

  constructor({pointsContainer, pointsModel, destinationsModel, offersModel}) {
    this.#pointsContainer = pointsContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.get()];

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.TIME:
        return this.#points.sort(sortPointByTime);
      case SortType.PRICE:
        return this.#points.sort(sortPointByPrice);
      case SortType.DAY:
        return this.#points.sort(sortPointByDay);
    }
    return this.#points;
  }

  init() {
    this.#renderTrip();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.update(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.add(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.delete(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
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

  #renderPoints = () => {
    this.points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderPoints();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#pointsContainer);
  };

  #renderPointsContainer = () => {
    render(this.#pointsListComponent, this.#pointsContainer);
  };

  #renderNoPoint = () => {
    if (this.#points.length === 0) {
      render(new NoPointView(), this.#pointsListComponent.element);
    }
  };

  #renderTrip = () => {
    this.#renderSort();
    this.#renderPointsContainer();
    this.#renderNoPoint();
    this.#renderPoints();
  };
}

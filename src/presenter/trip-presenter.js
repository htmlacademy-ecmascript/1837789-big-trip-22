import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import {render} from '../framework/render.js';
import NoPointView from '../view/no-point-view.js';
import {updateItem} from '../utils/common.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #pointsListComponent = new PointListView();
  #sortComponent = new SortView();
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
  }

  init() {
    //console.log(this.#points);
    this.#renderTrip();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointsChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    //console.log(this.#points);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsContainer: this.#pointsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handlePointsChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints = () => {
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderSort = () => {
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

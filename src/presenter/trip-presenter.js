import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import {render} from '../framework/render.js';
import NoPointView from '../view/no-point-view.js';

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
    render(this.#sortComponent, this.#pointsContainer);
    render(this.#pointsListComponent, this.#pointsContainer);
    if (this.#points.length === 0) {
      render(new NoPointView(), this.#pointsListComponent.element);
      return;
    }
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsContainer: this.#pointsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
    });

    pointPresenter.init(point);
  }
}

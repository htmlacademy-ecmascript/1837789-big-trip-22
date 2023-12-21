import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import {render, replace} from '../framework/render.js';
import NoPointView from '../view/no-point-view.js';

export default class TripPresenter {
  #pointsListComponent = new PointListView();
  #sortComponent = new SortView();
  #pointsContainer = null;
  #destinations = null;
  #offers = null;
  #allOffers = null;
  #allDestinations = null;
  #points = null;

  constructor({pointsContainer, pointsModel, destinationsModel, offersModel}) {
    this.#pointsContainer = pointsContainer;
    this.#destinations = destinationsModel;
    this.#offers = offersModel;
    this.#allOffers = offersModel.get();
    this.#allDestinations = destinationsModel.get();
    this.#points = pointsModel.get();
  }

  init() {
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
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point,
      pointDestinations: this.#destinations.getById(point.destination),
      pointOffers: this.#offers.getByType(point.type),
      onPointClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new PointEditView({
      point,
      pointDestinations: this.#destinations.getById(point.destination),
      pointOffers: this.#offers.getByType(point.type),
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      onResetClick: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onPointEditSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#pointsListComponent.element);
  }
}

import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import {render, replace} from '../framework/render.js';

export default class PointPresenter {
  #pointsContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #allOffers = null;
  #allDestinations = null;
  #point = null;

  #pointComponent = null;
  #pointEditComponent = null;

  constructor({pointsContainer, destinationsModel, offersModel}) {
    this.#pointsContainer = pointsContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#allOffers = offersModel.get();
    this.#allDestinations = destinationsModel.get();
  }

  init(point) {
    this.#point = point;

    this.#pointComponent = new PointView({
      point: this.#point,
      pointDestinations: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type).filter((offer) => point.offers.includes(offer.id)),
      onPointClick: () => {
        this.#replacePointToForm();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      }
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      pointDestinations: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      onResetClick: () => {
        this.#replaceFormToPoint();
        document.removeEventListener('keydown', this.#escKeyDownHandler);
      },
      onPointEditSubmit: () => {
        this.#replaceFormToPoint();
        document.removeEventListener('keydown', this.#escKeyDownHandler);
      }
    });

    render(this.#pointComponent, this.#pointsContainer);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm () {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }
}

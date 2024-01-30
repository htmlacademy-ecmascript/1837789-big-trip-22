import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import {render, replace, remove} from '../framework/render.js';
import {EditType, Mode} from '../const/point-const.js';
import {UserAction, UpdateType} from '../const/point-const.js';

export default class PointPresenter {
  #pointsContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #allOffers = null;
  #allDestinations = null;
  #point = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  #pointComponent = null;
  #pointEditComponent = null;

  constructor({pointsContainer, destinationsModel, offersModel, onDataChange, onModeChange}) {
    this.#pointsContainer = pointsContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#allOffers = offersModel.get();
    this.#allDestinations = destinationsModel.get();
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      pointDestinations: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type).filter((offer) => point.offers.includes(offer.id)),
      onPointClick: this.#handlePointClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      onResetClick: this.#handleFormClose,
      onPointEditSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      modeAddForm: EditType.EDITING
    });
    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointsContainer);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if(this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm () {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handlePointClick = () => {
    this.#replacePointToForm();
  };

  #handleFormSubmit = (update) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update);
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point);
  };

  #handleFormClose = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting () {
    if(this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }
    if(this.#mode === Mode.EDITING) {
      const resetFormState = () => {
        this.#pointEditComponent.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      };

      this.#pointEditComponent.shake(resetFormState);
    }
  }
}

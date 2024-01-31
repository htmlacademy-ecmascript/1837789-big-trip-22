import {remove, render, RenderPosition} from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import {UserAction, UpdateType, EditType} from '../const/point-const.js';

export default class NewPointPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #pointNewComponent = null;

  constructor({container, destinationsModel, offersModel, onDataChange, onDestroy}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointNewComponent !== null) {
      return;
    }
    this.#pointNewComponent = new PointEditView({
      allDestinations: this.#destinationsModel.get(),
      allOffers: this.#offersModel.get(),
      onResetClick: this.#handleResetClick,
      onDeleteClick: this.#handleResetClick,
      onPointEditSubmit: this.#handleFormSubmit,
      modeAddForm: EditType.CREATING
    });
    render(this.#pointNewComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointNewComponent === null) {
      return;
    }
    this.#handleDestroy();

    remove(this.#pointNewComponent);
    this.#pointNewComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleResetClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  setSaving() {
    this.#pointNewComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointNewComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#pointNewComponent.shake(resetFormState);
  }
}

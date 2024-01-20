import {render, RenderPosition} from '../framework/render.js';
import TripInfo from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #headerContainer = null;
  #tripInfoComponent = null;

  constructor({headerContainer}) {
    this.#headerContainer = headerContainer;
    this.#tripInfoComponent = new TripInfo();

  }

  init() {

    render(this.#tripInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
  }

}

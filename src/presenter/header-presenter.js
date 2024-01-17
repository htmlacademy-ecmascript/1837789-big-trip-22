import {render, RenderPosition} from '../framework/render.js';
import TripInfo from '../view/trip-info-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';

export default class HeaderPresenter {
  #headerContainer = null;
  #filterComponent = null;
  #tripInfoComponent = null;
  #newPointButtonComponent = null;

  constructor({headerContainer}) {
    this.#headerContainer = headerContainer;
    this.#tripInfoComponent = new TripInfo();

  }

  init() {

    render(this.#tripInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);

    this.#newPointButtonComponent = new NewPointButtonView({
      onButtonClick: this.#buttonClickHandler,
    });
    render(this.#newPointButtonComponent, this.#headerContainer);
  }

  // Методы для New Buttton --------------------------------------------

  #buttonClickHandler = () => {
    //console.log('1');
  };

  // Методы для Filter -------------------------------------------------


  // Методы для tripInfo --------------------------------------------
}

import FilterView from '../view/filter-view.js';
import TripInfo from '../view/trip-info-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import {render} from '../framework/render.js';

export default class HeaderPresenter {
  #points = null;
  #pointsModel = null;
  #headerContainer = null;
  #filterType = null;
  #filterComponent = null;
  #tripInfoComponent = null;
  #newPointButtonComponent = null;

  constructor({pointsModel, filterType, headerContainer}) {
    this.#pointsModel = pointsModel;
    this.#points = this.#pointsModel.get();
    this.#headerContainer = headerContainer;
    this.#filterType = filterType;
    this.#filterComponent = new FilterView(this.#points, this.#filterType);
    this.#tripInfoComponent = new TripInfo();
  }

  init() {
    render(this.#tripInfoComponent, this.#headerContainer);
    render(this.#filterComponent, this.#headerContainer);
    this.#newPointButtonComponent = new NewPointButtonView({
      onButtonClick: this.#buttonClickHandler,
    });
    render(this.#newPointButtonComponent, this.#headerContainer);
  }

  #buttonClickHandler = () => {
    //console.log('1');
  };

}

import FilterView from '../view/filter-view.js';
//import {FilterType, filter} from '../const/filter-const.js';
import {render} from '../framework/render.js';
//import {generateFilter} from '../utils/filter-utils.js';

export default class FilterPresenter {
  #points = null;
  #pointsModel = null;
  #filtersContainer = null;
  #filterType = null;
  #filterComponent = null;

  constructor({pointsModel, filterType, filtersContainer}) {
    this.#pointsModel = pointsModel;
    this.#points = this.#pointsModel.get();
    this.#filtersContainer = filtersContainer;
    this.#filterType = filterType;
    this.#filterComponent = new FilterView(this.#points, this.#filterType);
  }

  init() {
    render(this.#filterComponent, this.#filtersContainer);
  }
}

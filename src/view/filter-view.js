import AbstractView from '../framework/view/abstract-view.js';
import {FilterType, filterValues} from '../const/filter-const.js';
import {getUpperFirstChar} from '../utils/common.js';

function createFilterTemplate(points, currentFilterType = FilterType.EVERYTHING) {
  return (
    `<div class="trip-main__trip-controls  trip-controls">
      <div class="trip-controls__filters">
      <h2 class="visually-hidden">Filter events</h2>
      <form class="trip-filters" action="#" method="get">
      ${filterValues.map(({type, getPoints}) => {
      const count = getPoints(points).length;
      return (`<div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
    value="${type}" ${count ? '' : 'disabled'}${type === currentFilterType ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${type}">${getUpperFirstChar(type)}</label>
  </div>`);
    }).join('')}

    <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
    </div>
    </div>`
  );
}

export default class FilterView extends AbstractView{
  #points = null;
  #filterType = null;

  constructor(points, filterType) {
    super();
    this.#points = points;
    this.#filterType = filterType;
  }

  get template() {
    return createFilterTemplate(this.#points, this.#filterType);
  }
}

import AbstractView from '../framework/view/abstract-view.js';
import {FilterType, filterValues} from '../const/filter-const.js';
//import {generateFilter} from '../utils/filter-utils.js';

/*
function createFilterItemTemplate(filter, isChecked) {
  const {type, count} = filter;

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type.toLowerCase()}" ${isChecked ? 'checked' : ''} ${count === 0 ? 'disabled' : ''}/>
      <label class="trip-filters__filter-label" for="filter-${type.toLowerCase()}">${type}</label>
    </div> `
  );
}

function createFilterTemplate(filterItems) {
  const filterItemsTemplate = filterItems.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('');
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}
*/

function createFilterTemplate(points, currentFilterType = FilterType.EVERYTHING) {
  return (
    `<form class="trip-filters" action="#" method="get">
    ${filterValues.map(({type, getPoints}) => {
      const count = getPoints(points).length;
      return (`<div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
    value="${type}" ${count ? '' : 'disabled'}${type === currentFilterType ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
  </div>`);
    }).join('')}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
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

import AbstractView from '../framework/view/abstract-view.js';

const filterValues = ['Everything', 'Future', 'Present', 'Past'];

function createFilterTemplate(points) {
  return (
    `<form class="trip-filters" action="#" method="get">
    ${filterValues.map((value, index) => {
      const valueLowerCase = value.toLowerCase();
      let switchAttribute = '';
      if (points.length === 0) {
        switchAttribute = 'disabled';
      } else if (index === 1) {
        switchAttribute = 'checked';
      }
      return (`<div class="trip-filters__filter">
    <input id="filter-${valueLowerCase}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
    value="${valueLowerCase}" ${switchAttribute}>
    <label class="trip-filters__filter-label" for="filter-${valueLowerCase}">${value}</label>
  </div>`);
    }).join('')}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
  );
}

export default class FilterView extends AbstractView{
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createFilterTemplate(this.#points);
  }
}

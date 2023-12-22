import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs().isBefore(dayjs(point.dateFrom))),
  [FilterType.PRESENT]: (points) => points.filter((point) => dayjs().isBefore(dayjs(point.dateTo)) && dayjs().isAfter(dayjs(point.dateFrom))),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs().isAfter(dayjs(point.dateTo)))
};
const filterValues = Object.entries(filter).map(([type, getPoints]) => ({
  type,
  getPoints,
}));

function createFilterTemplate(points, currentFilterType = FilterType.EVERYTHING) {
  //console.log(filter['past'](points));
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

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createFilterTemplate(this.#points);
  }
}

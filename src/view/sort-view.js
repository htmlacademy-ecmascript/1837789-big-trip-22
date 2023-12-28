import AbstractView from '../framework/view/abstract-view.js';

const sortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const sortValues = ['day', 'event', 'time', 'price', 'offers'];

function createSortTemplate(currentSortType = sortType.DAY) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${
    sortValues.map((value) => {
      const isDisabled = value === sortType.EVENT || value === sortType.OFFERS;
      return (`<div class="trip-sort__item  trip-sort__item--${value}">
                <input id="sort-${value}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
                value="sort-${value}" data-sort-type="${value}" ${isDisabled ? 'disabled' : ''}${currentSortType === value ? 'checked' : ''}>
                <label class="trip-sort__btn" for="sort-${value}">${value}</label>
              </div>`);
    }).join('')
    }
  </form>`
  );
}

export default class SortView extends AbstractView{
  get template() {
    return createSortTemplate();
  }
}

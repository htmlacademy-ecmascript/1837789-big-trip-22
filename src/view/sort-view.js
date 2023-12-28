import AbstractView from '../framework/view/abstract-view.js';
import {SortType, sortValues} from '../const/sort-const.js';

function createSortTemplate(currentSortType = SortType.DAY) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${
    sortValues.map((value) => {
      const isDisabled = value === SortType.EVENT || value === SortType.OFFERS;
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
  #handleSortTypeChange = null;
  constructor({onSortTypeChange}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate();
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}

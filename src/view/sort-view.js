import AbstractView from '../framework/view/abstract-view.js';

const sortValues = ['Day', 'Event', 'Time', 'Price', 'Offers'];

function createSortTemplate() {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${
    sortValues.map((value, index) => {
      const valueLowerCase = value.toLowerCase();
      let switchAttribute = '';
      if (index === sortValues.length - 1) {
        switchAttribute = 'disabled';
      } else if (index === 1) {
        switchAttribute = 'checked';
      }
      return (`<div class="trip-sort__item  trip-sort__item--${valueLowerCase}">
                <input id="sort-${valueLowerCase}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
                value="sort-${valueLowerCase}" ${switchAttribute}>
                <label class="trip-sort__btn" for="sort-${valueLowerCase}">${value}</label>
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

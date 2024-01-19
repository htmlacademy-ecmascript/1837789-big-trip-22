import AbstractView from '../framework/view/abstract-view.js';

const NoPointsTextType = {
  everything: 'Click New Event to create your first point',
  future: 'There are no future events now',
  present: 'There are no present events now',
  past: 'There are no past events now',
};

function createNoPointTemplate(filterType) {
  const NoPointsTextValue = NoPointsTextType[filterType];
  return (
    `<p class="trip-events__msg">
    ${NoPointsTextValue}
    </p>`
  );
}

export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointTemplate(this.#filterType);
  }
}

import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {getScheduleDate} from '../utils/date-utils.js';
import {getUpperFirstChar} from '../utils/common.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import {EditType} from '../const/point-const.js';
import he from 'he';

const PointBlank = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'flight',
};

function createDestinationList(allDestinations) {
  const cityDestinations = Array.from(new Set(allDestinations.map((item) => item.name)));
  return (`
  <datalist id="destination-list-1">
  ${
    cityDestinations.map(
      (city) => `<option value="${city}"></option>`
    ).join('')
    }
  </datalist>
  `);
}

function createTypeTemplate(allOffers, currentType) {
  return (`
    ${
    allOffers.map(
      (offer) => ` <div class="event__type-item">
                    <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}"
                    ${currentType === offer.type ? 'checked' : ''}>
                    <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${getUpperFirstChar(offer.type)}</label>
                  </div>`
    ).join('')
    }
  `);
}

function createDateTemplate(dateFrom, dateTo, isDateCreating, isDisabled) {
  return (`
    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" required id="event-start-time-1" type="text" name="event-start-time" ${isDisabled ? 'disabled' : ''} value="${isDateCreating ? getScheduleDate(dateFrom) : ''}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" required id="event-end-time-1" type="text" name="event-end-time"  ${isDisabled ? 'disabled' : ''} value="${isDateCreating ? getScheduleDate(dateTo) : ''}">
    </div>
`);
}

function createPicturesTemplate(pictures) {
  return (`
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((picture) => `
          <img class="event__photo" src="${picture.src}" alt="${picture.description}">
        `).join('')}
      </div>
    </div>
  `);
}

function createDestinationsTemplate (hasDestinations, destinationById) {
  return (`
  ${hasDestinations ? `
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destinationById.description}</p>
    ${destinationById?.pictures.length > 0 ? createPicturesTemplate(destinationById.pictures) : ''}
  </section>
  ` : ''}
`);
}

function createEditPointOffersTemplate(hasOffers, offersByType, point, isDisabled) {
  return (`
  ${hasOffers ? `
  <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
    ${
    offersByType.map(
      (offer) => {
        const checked = point.offers.includes(offer.id) ? 'checked' : '';
        return (
          `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}"
          data-offer-id=${offer.id} ${checked} ${isDisabled ? 'disabled' : ''}>
          <label class="event__offer-label" for="event-offer-${offer.id}">
            <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`);
      }).join('')
    }
    </div>
    </section>` : ''}
  `);
}

const createButtonTemplate = (isCreating, isDeleting, isDisabled) => {
  if (isCreating) {
    return `
      <button class="event__reset-btn" type="reset">Cancel</button>
    `;
  }
  return `
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
    <button class="event__rollup-btn" type="button" ><span class="visually-hidden">Open event</span></button>
    `;
};

function createPointEditTemplate({state, allOffers, allDestinations, modeAddForm}) {
  const point = state;
  const {type, dateFrom, dateTo, basePrice, destination} = point;
  const offersByType = allOffers.find((item) => item.type === point.type).offers;
  const destinationById = allDestinations.find((item) => item.id === destination);
  const {isDisabled, isSaving, isDeleting} = state;
  const allOffersTemplate = createTypeTemplate(allOffers, type);
  const citiesBlock = createDestinationList(allDestinations);
  const hasDestinations = destinationById?.pictures.length > 0 || destinationById?.description;
  const hasOffers = offersByType.length > 0;
  const isCreating = (modeAddForm === EditType.CREATING);
  return (`
  <li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">

    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${allOffersTemplate}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationById ? he.encode(destinationById.name) : ''}" list="destination-list-1"
         ${isDisabled ? 'disabled' : ''}>
        ${citiesBlock}
      </div>

      ${createDateTemplate(dateFrom, dateTo, isDisabled)}

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${he.encode(String(basePrice))}" min="0" max="100000"  ${isDisabled ? 'disabled' : ''}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
      ${createButtonTemplate(isCreating, isDeleting, isDisabled)}
    </header>

    <section class="event__details">

          ${createEditPointOffersTemplate(hasOffers, offersByType, point, isDisabled)}


          ${createDestinationsTemplate(hasDestinations, destinationById)}

    </section>

  </form>
</li>
    `);
}

export default class PointEditView extends AbstractStatefulView {
  #allOffers = null;
  #allDestinations = null;
  #onResetClick = null;
  #onPointEditSubmit = null;
  #onDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #modeAddForm = null;

  constructor({point = PointBlank, allOffers, allDestinations, onPointEditSubmit, onResetClick, onDeleteClick, modeAddForm}) {
    super();
    this._setState(PointEditView.parsePointToState(point));
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#modeAddForm = modeAddForm;
    this._restoreHandlers();
    this.#onResetClick = onResetClick;
    this.#onPointEditSubmit = onPointEditSubmit;
    this.#onDeleteClick = onDeleteClick;
  }

  // Перегружаем метод родителя removeElement,
  // чтобы при удалении удалялся более не нужный календарь
  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  get template() {
    return createPointEditTemplate({
      state: this._state,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      modeAddForm: this.#modeAddForm
    });
  }

  _restoreHandlers() {
    if(this.#modeAddForm === EditType.EDITING) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#resetButtonClickHandler);
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    }
    this.element.querySelector('form').addEventListener('submit', this.#pointEditSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.#setDatepickers();
    if(this.#modeAddForm === EditType.CREATING) {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    }
  }

  reset = (point) => {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  };

  #resetButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();
  };

  #pointEditSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onPointEditSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#allDestinations.find((pointDestination) => pointDestination.name === evt.target.value);
    const selectedDestinationId = (selectedDestination) ? selectedDestination.id : this._state.destination;

    this.updateElement({
      destination: selectedDestinationId
    });
  };

  #offerChangeHandler = () => {
    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      offers: checkedBoxes.map((element) => element.dataset.offerId)
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      basePrice: evt.target.value
    });
  };

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
    this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  #setDatepickers = () => {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');
    const config = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {
        firstDayOfWeek: 1,
      },
      'time_24hr': true,
      allowInput: true
    };
    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        ...config,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromCloseHandler,
        maxDate: this._state.dateTo,
      }
    );
    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        ...config,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToCloseHandler,
        minDate: this._state.dateFrom,
      }
    );
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }
}

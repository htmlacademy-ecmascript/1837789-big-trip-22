import {createElement} from '../render.js';
import {getScheduleDate} from '../utils.js';

function createOffersTemplate(allOffers, typeName) {
  return (`
    ${
    allOffers.map(
      (offer) => ` <div class="event__type-item">
                    <input id="event-type-${offer.type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type.toLowerCase()}"
                    ${typeName === offer.type ? 'checked' : ''}>
                    <label class="event__type-label  event__type-label--${offer.type.toLowerCase()}" for="event-type-${offer.type.toLowerCase()}-1">${offer.type}</label>
                  </div>`
    ).join('')
    }
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

function createEditPointOffersTemplate(offers) {
  return (`
    ${
    offers.map(
      (offer, index) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${index + 1}" type="checkbox" name="event-offer-luggage"
      ${index === 1 ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-luggage-${index + 1}">
        <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
    ).join('')
    }
  `);
}

function createPointEditTemplate({point, pointDestinations, pointOffers, allOffers}) {

  const {type, dateFrom, dateTo, basePrice} = point;
  const {name, description, pictures} = pointDestinations;
  const offersTemplate = createEditPointOffersTemplate(pointOffers);
  const allOffersTemplate = createOffersTemplate(allOffers, type);
  const picturesBlock = createPicturesTemplate(pictures);
  return (`
  <li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getScheduleDate(dateFrom)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getScheduleDate(dateTo)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${offersTemplate}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${name} ${description}</p>
      </section>
      ${pictures ? picturesBlock : ''}
    </section>
  </form>
</li>
    `);
}

export default class PointEditView {
  constructor({point, pointDestinations, pointOffers, allOffers}) {
    this.point = point;
    this.pointDestinations = pointDestinations;
    this.pointOffers = pointOffers;
    this.allOffers = allOffers;
  }

  getTemplate() {
    return createPointEditTemplate({
      point: this.point,
      pointDestinations: this.pointDestinations,
      pointOffers: this.pointOffers,
      allOffers: this.allOffers
    });
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

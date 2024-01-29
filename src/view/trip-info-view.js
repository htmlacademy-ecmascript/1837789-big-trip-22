import AbstractView from '../framework/view/abstract-view.js';
import {formatStringToShortDate} from '../utils/date-utils.js';

const MAX_LENGTH = 3;

function createTripInfoTemplate({points, destinations, offersModel}) {
  const DAY_START = formatStringToShortDate(points[0].dateFrom);
  const DAY_END = formatStringToShortDate(points[points.length - 1].dateFrom);
  let price = 0;
  const cityNames = [];
  let destinationById = destinations.find((item) => item.id === points[0].destination);
  cityNames.push(destinationById.name);

  if (points.length > MAX_LENGTH) {
    cityNames.push('...');
    destinationById = destinations.find((item) => item.id === points[points.length - 1].destination);
    cityNames.push(destinationById.name);
  }else {
    for (let i = 1; i < points.length; i++) {
      destinationById = destinations.find((item) => item.id === points[i].destination);
      cityNames.push(destinationById.name);
    }
  }

  points.forEach((point) => {
    price += point.basePrice;
    const offers = offersModel.getByType(point.type).filter((offer) => point.offers.includes(offer.id));
    const selectedOffers = offers.filter((offer) => point.offers.includes(offer.id));
    const selectedOffersPrice = selectedOffers.reduce((accumulator, selectedOffer) => accumulator + selectedOffer.price, 0);
    price += selectedOffersPrice;
  });

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${cityNames[0] ? cityNames[0] : ''} ${cityNames[1] ? `&mdash; ${cityNames[1]}` : ''}  ${cityNames[2] ? `&mdash; ${cityNames[2]}` : ''}</h1>

     <p class="trip-info__dates">${DAY_START}${points.length > 1 ? `&nbsp;&mdash;&nbsp;${DAY_END}` : ''}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price ? price : ''}</span>
    </p>
      </section>`;
}

export default class TripInfoView extends AbstractView{
  #points = null;
  #destinations = null;
  #offersModel = null;

  constructor({points, destinations, offersModel}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offersModel = offersModel;
  }

  get template() {
    return createTripInfoTemplate({
      points: this.#points,
      destinations: this.#destinations,
      offersModel: this.#offersModel
    });
  }
}

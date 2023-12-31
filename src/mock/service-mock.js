import {getRandomInteger, getRandomArrayElement} from './utils-mock.js';
import {generateMockDestination} from './destination-mock.js';
import {generateMockOffer} from './offer-mock.js';
import {generateMockPoint} from './point-mock.js';
import {
  TYPES,
  DESTINATION_COUNT,
  OFFER_COUNT,
  POINT_COUNT,
} from './const-mock.js';

export default class ServiceMock {
  constructor() {
    this.destinations = [...this.generateMockDestinations()];
    this.offers = this.generateMockOffers();
    this.points = this.generateMockPoints();
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getPoints() {
    return this.points;
  }

  generateMockDestinations() {
    return Array.from({length: DESTINATION_COUNT}, () =>
      generateMockDestination());
  }

  generateMockOffers() {
    return TYPES.map((type) => ({
      type,
      offers: Array.from(
        { length: getRandomInteger(1, OFFER_COUNT) },
        () => generateMockOffer()),
    }));
  }

  generateMockPoints() {
    return Array.from({length: POINT_COUNT}, () => {
      const type = getRandomArrayElement(TYPES);
      const destination = getRandomArrayElement(this.destinations);
      const offersByType = this.offers.find(
        (offerByType) => offerByType.type === type
      );
      const offersIds = offersByType
        ? offersByType.offers
          .slice(0, getRandomInteger(0, OFFER_COUNT))
          .map((offer) => offer.id)
        : [];

      return generateMockPoint(type, destination.id, offersIds);
    });
  }
}

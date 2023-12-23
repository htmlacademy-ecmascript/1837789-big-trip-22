import {getRandomInteger, getRandomArrayElement, createUniqueId} from './utils-mock.js';
import {OFFERS, PRICE, POINT_COUNT, OFFER_COUNT} from './const-mock.js';

const OFFERS_COUNT = POINT_COUNT * OFFER_COUNT;
const offerId = createUniqueId(1, OFFERS_COUNT);

function generateMockOffer() {
  return {
    id: offerId(),
    title: getRandomArrayElement(OFFERS),
    price: getRandomInteger(PRICE.min, PRICE.max),
  };
}

export {generateMockOffer};

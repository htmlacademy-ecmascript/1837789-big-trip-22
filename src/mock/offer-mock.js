import {getRandomInteger, getRandomArrayElement} from './utils-mock.js';
import {OFFERS, PRICE} from './const-mock.js';
import {nanoid} from 'nanoid';

function generateMockOffer() {
  return {
    id: nanoid(),
    title: getRandomArrayElement(OFFERS),
    price: getRandomInteger(PRICE.min, PRICE.max),
  };
}

export {generateMockOffer};

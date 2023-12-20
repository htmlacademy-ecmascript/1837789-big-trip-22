import {getRandomInteger, createUniqueId} from '../utils.js';
import {PRICE, POINT_COUNT} from '../const.js';
import {getDate} from './date-mock.js';

const pointId = createUniqueId(1, POINT_COUNT);
function generateMockPoint(type, destinationId, offerIds) {
  return {
    id: pointId(),
    basePrice: getRandomInteger(PRICE.min, PRICE.max),
    dateFrom: getDate({next: false}),
    dateTo: getDate({ next: true }),
    destination: destinationId,
    isFavorite: !!getRandomInteger(0, 1),
    offers: offerIds,
    type,
  };
}

export {generateMockPoint};


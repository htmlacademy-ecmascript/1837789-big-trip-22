import {getRandomArrayElement, getRandomInteger, createUniqueId} from '../utils.js';
import {CITIES, DESCRIPTIONS, POINT_COUNT, DESTINATION_COUNT} from '../const.js';

const PICTURE_COUNT = 10;
const DESTINATIONS_COUNT = POINT_COUNT * DESTINATION_COUNT;
const destinationId = createUniqueId(1, DESTINATIONS_COUNT);

function generateMockDestination() {
  const city = getRandomArrayElement(CITIES);
  const description = getRandomArrayElement(DESCRIPTIONS);
  return {
    id: destinationId(),
    description: description,
    name: city,
    pictures: [{
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(0, PICTURE_COUNT)}`,
      description: `${city} ${description}`,
    }],
  };
}

export {generateMockDestination};

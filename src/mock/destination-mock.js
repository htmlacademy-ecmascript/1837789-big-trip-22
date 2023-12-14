import {getRandomArrayElement, getRandomInteger, createUniqueId} from '../utils.js';
import {CITIES, DESCRIPTIONS, POINT_COUNT, DESTINATION_COUNT} from '../const.js';

const PICTURE_COUNT = 5;
const DESTINATIONS_COUNT = POINT_COUNT * DESTINATION_COUNT;
const destinationId = createUniqueId(1, DESTINATIONS_COUNT);

function generatePicture(city, description) {
  return {
    src: `img/photos/${getRandomInteger(1, PICTURE_COUNT)}.jpg`,
    description: `${city} ${description}`,
  };
}
function generatePictures(city, description) {
  return Array.from({length: getRandomInteger(1, PICTURE_COUNT)}, () => generatePicture(city, description));
}

function generateMockDestination() {
  const city = getRandomArrayElement(CITIES);
  const description = getRandomArrayElement(DESCRIPTIONS);
  return {
    id: destinationId(),
    description: description,
    name: city,
    pictures: generatePictures(city, description),
  };
}

export {generateMockDestination};

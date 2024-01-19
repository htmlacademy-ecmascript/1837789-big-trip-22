import {getRandomArrayElement, getRandomInteger} from './utils-mock.js';
import {CITIES, DESCRIPTIONS} from './const-mock.js';
import {nanoid} from 'nanoid';

const PICTURE_COUNT = 5;

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
    id: nanoid(),
    description: description,
    name: city,
    pictures: generatePictures(city, description),
  };
}

export {generateMockDestination};

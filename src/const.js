const TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. ',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
];

const CITIES = [
  'Amsterdam',
  'Chamonix',
  'Geneva',
  'Rio',
  'Paris',
  'Tokyo',
  'Zurich',
];

const OFFERS = [
  'Rent a car',
  'Add breakfast',
  'Book tickets',
  'Add luggage',
  'Switch to comfort',
  'Order Uber',
  'Lunch in city',
];

const PRICE = {
  min: 20,
  max: 10000,
};

const DURATION = {
  hour: 2,
  day: 1,
  min: 20,
};

const POINT_BLANCK = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'Taxi',
};

const DESTINATION_COUNT = 4;

const OFFER_COUNT = 4;

const POINT_COUNT = 10;


export {TYPES,
  DESCRIPTIONS,
  CITIES,
  OFFERS,
  PRICE,
  DURATION,
  DESTINATION_COUNT,
  OFFER_COUNT,
  POINT_COUNT,
  POINT_BLANCK};

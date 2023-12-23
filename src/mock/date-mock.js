import dayjs from 'dayjs';
import {getRandomInteger} from './utils-mock.js';
import {DURATION} from './const-mock.js';

let date = dayjs().subtract(getRandomInteger(0, DURATION.day), 'day').toDate();

function getDate({next}) {
  const minsGap = getRandomInteger(0, DURATION.min);
  const hoursGap = getRandomInteger(0, DURATION.hour);
  const daysGap = getRandomInteger(0, DURATION.day);

  if (next) {
    date = dayjs(date)
      .add(minsGap, 'minute')
      .add(hoursGap, 'hour')
      .add(daysGap, 'day')
      .toDate();
  }
  return date;
}

export {getDate};

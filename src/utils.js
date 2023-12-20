import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

const DateFormat = {
  dayTime: 'YY-MM-DD HH:mm',
  shortDate: 'MMM DD',
  time: 'HH:mm',
  scheduleDate: 'DD/MM/YY HH:mm',
};

// Работа с датой

dayjs.extend(duration);
dayjs.extend(relativeTime);

const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;

const MSEC_IN_HOUR = MIN_IN_HOUR * SEC_IN_MIN * MSEC_IN_SEC;

const MSEC_IN_DAY = HOUR_IN_DAY * MSEC_IN_HOUR;

function formatStringToDayTime(dueDate) {
  return dayjs(dueDate).format(DateFormat.dayTime);
}

function formatStringToShortDate(dueDate) {
  return dayjs(dueDate).format(DateFormat.shortDate);
}

function formatStringToTime(dueDate) {
  return dayjs(dueDate).format(DateFormat.time);
}

function getPointDuration(dateFrom, dateTo) {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));

  let pointDuration = 0;

  switch (true) {
    case timeDiff >= MSEC_IN_DAY:
      pointDuration = dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
      break;
    case timeDiff >= MIN_IN_HOUR:
      pointDuration = dayjs.duration(timeDiff).format('HH[H] mm[M]');
      break;
    case timeDiff >= MSEC_IN_HOUR:
      pointDuration = dayjs.duration(timeDiff).format('mm[M]');
      break;
  }

  return pointDuration;
}

function getScheduleDate(dueDate) {
  return dayjs(dueDate).format(DateFormat.scheduleDate);
}

// Генерация случайного целого числа из заданного диапазона.

function getRandomInteger(min, max) {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
}

// Выбор рандомного элемента из массива данных

function getRandomArrayElement (items) {
  return items[getRandomInteger(0, items.length - 1)];
}
// Создание уникальных ключей для ID

function createUniqueId (min, max) {
  const previousValues = [];

  return function () {
    let currentValue = getRandomInteger(min, max);
    if (previousValues.length >= (max - min + 1)) {
      //console.error('Перебраны все числа из диапазона от ' + min + ' до ' + max);
      return null;
    }
    while (previousValues.includes(currentValue)) {
      currentValue = getRandomInteger(min, max);
    }
    previousValues.push(currentValue);
    return currentValue;
  };
}

export {
  getRandomInteger,
  getRandomArrayElement,
  createUniqueId,
  formatStringToDayTime,
  formatStringToShortDate,
  formatStringToTime,
  getPointDuration,
  getScheduleDate
};


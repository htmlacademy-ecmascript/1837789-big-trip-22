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
  createUniqueId
};


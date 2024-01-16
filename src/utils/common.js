// Функция для обновления точек

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

// Функция преобразоввывает первую букву строки в верхний регистр

const getUpperFirstChar = (str) => {
  if (str) {
    return str[0].toUpperCase() + str.slice(1);
  }
};

export {updateItem, getUpperFirstChar};

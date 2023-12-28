// Функция для обновления точек

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);


export {updateItem};

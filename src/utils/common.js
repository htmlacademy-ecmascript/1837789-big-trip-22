const getUpperFirstChar = (str) => {
  if (str) {
    return str[0].toUpperCase() + str.slice(1);
  }
};

export {getUpperFirstChar};

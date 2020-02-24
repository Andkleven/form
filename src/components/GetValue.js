export default (value, queryName, indexNumber, fieldName) => {
  let test;
  Object.keys(value).forEach(key => {
    if (
      value[key][queryName] &&
      value[key][queryName][indexNumber] !== undefined &&
      value[key][queryName][indexNumber][fieldName] !== undefined
    ) {
      test = value[key][queryName][indexNumber][fieldName];
    }
  });
  return test;
};

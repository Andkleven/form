function getValue(values, queryName, indexNumber, fieldName) {
  let test;
  Object.keys(values).forEach(key => {
    if (
      values[key][queryName] &&
      values[key][queryName][indexNumber] !== undefined &&
      values[key][queryName][indexNumber][fieldName] !== undefined
    ) {
      test = values[key][queryName][indexNumber][fieldName];
    }
  });
  return test;
}

export default getValue;

export const capitalize = (text, separator = "-") => {
  return text
    .split(separator)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

export const arraysMatch = (arr1, arr2) => {
  // Check if the arrays are the same length
  if (arr1.length !== arr2.length) return false;

  // Check if all items exist and are in the same order
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  // Otherwise, return true
  return true;
};

export const renameProp = (
  oldProp,
  newProp,
  { [oldProp]: old, ...others }
) => ({
  [newProp]: old,
  ...others
});

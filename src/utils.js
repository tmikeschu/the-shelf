// TODO: import ramda for currying and other utils

export const updateElement = xs => (index, x) => [
  ...xs.slice(0, index),
  typeof x === "function" ? x(xs[index]) : x,
  ...xs.slice(index + 1)
];

export const capitalize = s => s[0].toUpperCase() + s.slice(1).toLowerCase();

export const targVal = cb => ({ target: { value } }) => cb(value);

export const setFormData = (itemProps, item) => {
  Object.entries(itemProps).forEach(([prop, { setter }]) => {
    setter(item[prop]);
  });
};

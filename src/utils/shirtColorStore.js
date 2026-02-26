let currentColor = '#FFFFFF';
const listeners = [];

export const setColor = (color) => {
  if (!color) return;
  currentColor = color;
  listeners.forEach((callback) => callback(color));
};

export const getColor = () => currentColor;

export const subscribe = (callback) => {
  if (typeof callback !== 'function') return () => {};
  listeners.push(callback);
  
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
};
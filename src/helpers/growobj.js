// Helper function to add property/values to object and return immediately
module.exports = (obj, prop, value) => {
  return Object.defineProperty(obj, prop, {
    enumerable: true,
    configurable: true,
    writeable: true,
    value: value
  });
};

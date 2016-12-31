// Extract data type and store data as Buffer. Send as object
module.exports = (dataString) => {
  const matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  return {type: matches[1], data: new Buffer(matches[2], 'base64')};
};

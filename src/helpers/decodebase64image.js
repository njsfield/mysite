// Extract data type and store data as Buffer. Send as object
module.exports = (dataString) => {
  const matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  const response = {};

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');
  return response;
};

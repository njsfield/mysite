const fs = require('fs');
const path = require('path');

const readImages = (cb) => {
  fs.readdir(path.join(__dirname, '../../public/images'), (err, images) => {
    if (err) cb(err);
    else cb(null, images);
  });
};

const writeImage = (filename, data, cb) => {
  fs.writeFile(path.join(__dirname, '../../public/images', filename), data, (err) => {
    err ? cb(err) : cb(null);
  });
};

const deleteImage = (filename, cb) => {
  fs.writeFile(path.join(__dirname, '../../public/images', filename), (err) => {
    err ? cb(err) : cb(null);
  });
};

const sanitizeImagePath = (uri) => {
  uri = uri.replace(/\s/g, '-');
  uri = uri.toLowerCase();
  let images = fs.readdirSync(path.join(__dirname, '../../public/images'));

  // Check for images
  let imageFind = (uri) => {
    return images.indexOf(uri) > -1;
  };

  // While found
  while (imageFind(uri)) {
    if (/\d(?=\.)/.test(uri)) {
      uri = uri.replace(/\d(?=\.)/, (match) => { return `${++match}`; });
    } else {
      uri = uri.replace(/\./, '1.');
    }
  }
  return uri;
};

const decodeBase64Image = (dataString) => {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
};

module.exports = {
  readImages,
  writeImage,
  sanitizeImagePath,
  decodeBase64Image,
  deleteImage
};

const { checkDbForImage } = require('../../helpers/image-helpers');
const { addImage } = require('../../dbrequests/images');

// Add Image to Database
const addImageToDb = (req, reply) => {
  let imageData = req.payload;
  checkDbForImage(req.query.name, (err, fileName) => {
    err ? reply(err) : addImage(fileName, imageData, (err) => {
      err ? reply(err) : reply('done');
    });
  });
};

module.exports = {
  path: '/addimage',
  method: 'post',
  config: {
    payload: {
      maxBytes: 10485760235
    },
    auth: {
      strategy: 'session',
      mode: 'try'
    },
    handler: (req, reply) => {
      addImageToDb(req, reply);
    }
  }
};

const { prepareURIForDb } = require('../../helpers/uri-helpers');
const { addImage, getImages } = require('../../dbrequests/images');

// Add Image to Database
const addImageToDb = (req, reply) => {
  let imageData = req.payload;
  let uri = req.query.name;
  prepareURIForDb(uri, getImages, 'imageurl', (err, newURI) => {
    err ? reply(new Error('Problem checking database For Image')) : addImage(newURI, imageData, (err) => {
      err ? reply(new Error('Problem image to database')) : reply('done');
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

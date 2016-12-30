const { prepareURIForDb } = require('../../helpers/uri-helpers');
const { addImage, getImages } = require('../../dbrequests/images');
const credentialsCheck = require('../../helpers/credentialscheck');

// Add Image to Database
const addImageToDb = (req, reply) => {
  if (!credentialsCheck(req)) {
    reply('Not Authorized');
  } else {
    let imageData = req.payload;
    let uri = req.query.name;
    prepareURIForDb(uri, getImages, 'imageurl', (err, newURI) => {
      err ? reply(err) : addImage(newURI, imageData, (err) => {
        err ? reply(err) : reply('done');
      });
    });
  }
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
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    handler: (req, reply) => {
      addImageToDb(req, reply);
    }
  }
};

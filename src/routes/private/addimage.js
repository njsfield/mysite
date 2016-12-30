const { checkDbForImage } = require('../../helpers/image-helpers');
const { addImage } = require('../../dbrequests/images');
const credentialsCheck = require('../../helpers/credentialscheck');

// Add Image to Database
const addImageToDb = (req, reply) => {
  if (!credentialsCheck(req)) {
    // console.log('Not authorized');
    reply('Not Authorized');
  } else {
    let imageData = req.payload;
    // console.log('name:', req.query.name);
    // console.log('payload length:', req.payload.length);
    checkDbForImage(req.query.name, (err, fileName) => {
      // console.log('error checking filename:', err);
      // console.log('filename: ', fileName);
      err ? reply(err) : addImage(fileName, imageData, (err) => {
        // console.log('error adding image: ', err);
        // console.log('============================');
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
      // console.log('Addimage route called');
      addImageToDb(req, reply);
    }
  }
};

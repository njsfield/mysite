const decodeBase64Image = require('../../helpers/decodebase64image');
const { getImages, getImage, updateImageTitle } = require('../../dbrequests/images');
const credentialsCheck = require('../../helpers/credentialscheck');
const notJson = JSON.parse;
const authError = new Error('Not Authorized');

// Send Raw Image
const sendRawImage = (req, reply) => {
  getImage(req.params.url, (err, image) => {
    if (err) reply(err);
    image = decodeBase64Image(image.imagebody);
    reply(image.data).header('content-type', image.type);
  });
};

// Get all imageurls as array and send back
const getAllImageUrls = (req, reply) => {
  (!credentialsCheck(req)) ? reply(authError) : getImages((err, images) => {
    err ? reply(err) : reply({images: images.map(image => image.imageurl)});
  });
};

// UpdateImageTitle
const imageTitleHandler = (req, reply) => {
  let payload = notJson(req.payload);
  (!credentialsCheck(req)) ? reply(authError) : updateImageTitle(payload.imageurl, payload.imagetitle, (err) => {
    err ? reply(err) : reply(payload.imagetitle);
  });
};

// Get Image Data
const getImageData = (req, reply) => {
  (!credentialsCheck(req)) ? reply(authError) : getImage(req.query.imageurl, (err, image) => {
    (err ? reply(err) : reply(image));
  });
};

module.exports = {
  path: '/images/{url*}',
  method: ['get', 'post'],
  config: {
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
      if (req.method === 'get') {
        if (req.params.url) {
          sendRawImage(req, reply);
        } else if (req.query.imageurl) {
          getImageData(req, reply);
        } else {
          getAllImageUrls(req, reply);
        }
      } else {
        imageTitleHandler(req, reply);
      }
    }
  }
};

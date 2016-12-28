const { decodeBase64Image } = require('../../helpers/image-helpers');
const { getImages, getImage, updateImageTitle } = require('../../dbrequests/images');

// Send Raw Image
const sendRawImage = (req, reply) => {
  let imageurl = req.params.url;
  getImage(imageurl, (err, image) => {
    if (err) reply(err);
    image = decodeBase64Image(image.imagebody);
    reply(image.data).header('content-type', image.type);
  });
};

const getAllImageUrls = (req, reply) => {
  getImages((err, images) => {
    images = images.map(image => image.imageurl);
    err ? reply(err) : reply({images: images});
  });
};

// UpdateImageTitle
const imageTitleHandler = (req, reply) => {
  let payload = JSON.parse(req.payload);
  let imageurl = payload.imageurl;
  let imagetitle = payload.imagetitle || 'Custom Upload';
  updateImageTitle(imageurl, imagetitle, (err) => {
    (err ? reply(err) : reply(imagetitle));
  });
};

const getImageData = (req, reply) => {
  getImage(req.query.imageurl, (err, image) => {
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

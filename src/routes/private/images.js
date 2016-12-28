const { decodeBase64Image, sanitizeImagePath } = require('../../helpers/image-helpers');
const { addImage, getImages, getImage } = require('../../dbrequests/images');

const addImageToDb = (req, reply) => {
  let imageData = req.payload;
  sanitizeImagePath(req.query.name, (err, fileName) => {
    if (err) throw err;
    addImage(fileName, imageData, (err) => {
      err ? reply(err) : reply('done');
    });
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
          let imageurl = req.params.url;
          // Get image, decode, then send back in correct format
          getImage(imageurl, (err, image) => {
            if (err) reply(err);
            image = decodeBase64Image(image.imagebody);
            reply(image.data).header('content-type', image.type);
          });
        } else {
          // Get all image urls
          getImages((err, images) => {
            images = images.map(image => image.imageurl);
            err ? reply(err) : reply({images: images});
          });
        }
      } else {
        // Add image
        addImageToDb(req, reply);
      }
    }
  }
};

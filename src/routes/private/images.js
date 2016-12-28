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
          // Get image blob
          getImage(imageurl, (err, image) => {
            image = decodeBase64Image(image.imagebody).data;
            err ? reply(err) : reply(image);
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

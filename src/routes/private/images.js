const {readImages, writeImage, decodeBase64Image, sanitizeImagePath} = require('../../helpers/image-helpers');
const addImageToDb = require('../../dbrequests/addimage');
const privateImgs = (img) => !['site-logo.png', 'social-sprite.png'].includes(img);

module.exports = {
  path: '/images',
  method: ['get', 'post'],
  config: {
    auth: {
      strategy: 'session',
      mode: 'try'
    },
    handler: (req, reply) => {
      if (req.method === 'get') {
        readImages((err, images) => {
          err ? reply(err) : reply({images: images.filter(privateImgs)});
        });
      } else {
        let imageData = decodeBase64Image(req.payload);
        let fileName = sanitizeImagePath(req.query.name);
        writeImage(fileName, imageData.data, (err) => {
          err ? reply(err) : addImageToDb(fileName, (err) => {
            err ? reply(err) : reply('done');
          });
        });
      }
    }
  }
};

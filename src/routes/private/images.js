const {readImages, writeImage, decodeBase64Image, sanitizeImagePath} = require('../../helpers/image-helpers');
const addImageToDb = require('../../dbrequests/addimage');

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
          err ? reply(err) : reply({images: images});
        });
      } else {
        let imageData = decodeBase64Image(req.payload);
        let fileName = sanitizeImagePath(req.query.name);
        writeImage(fileName, imageData.data, (err) => {
          if (err) throw err;
          addImageToDb(fileName, (err) => {
            if (err) throw err;
            reply('done');
          });
        });
      }
    }
  }
};

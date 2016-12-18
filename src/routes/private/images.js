const fs = require('fs');
const path = require('path');
const decodeBase64Image = require('../../helpers/decode64baseimage.js');
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
        fs.readdir(path.join(__dirname, '../../../public/images'), (err, images) => {
          if (err) throw err;
          reply({images: images});
        });
      } else {
        let imageBuffer = decodeBase64Image(req.payload);
        let imageName = req.query.name;
        fs.writeFile(path.join(__dirname, '../../../public/images', imageName), imageBuffer.data, (err) => {
          if (err) throw err;
          addImageToDb(imageName, (err) => {
            if (err) throw err;
            reply('done');
          });
        });
      }
    }
  }
};

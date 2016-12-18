const getImage = require('../../dbrequests/getimages').getImage;
const updateImageTitle = require('../../dbrequests/updateimage');

module.exports = {
  path: '/image',
  method: ['get', 'post'],
  config: {
    auth: {
      strategy: 'session',
      mode: 'try'
    },
    handler: (req, reply) => {
      if (req.method === 'get') {
        getImage(req.query.imageurl, (err, image) => {
          (err ? reply(err) : reply(image));
        });
      } else {
        updateImageTitle(req.payload.imageurl, req.payload.imagetitle, (err) => {
          (err ? reply(err) : reply('updated image'));
        });
      }
    }
  }
};

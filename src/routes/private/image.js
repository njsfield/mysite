const getImage = require('../../dbrequests/getimages').getImage;
const updateImage = require('../../dbrequests/updateimage');

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
        updateImage(req.payload.imageurl, req.payload.imageid, (err) => {
          (err ? reply(err) : reply('updated image'));
        });
      }
    }
  }
};

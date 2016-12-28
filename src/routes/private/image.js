const { getImage, updateImageTitle } = require('../../dbrequests/images');

const imageTitleHandler = (req, reply) => {
  let payload = JSON.parse(req.payload);
  let imageurl = payload.imageurl;
  let imagetitle = payload.imagetitle || 'Custom Upload';
  updateImageTitle(imageurl, imagetitle, (err) => {
    (err ? reply(err) : reply(imagetitle));
  });
};

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
        imageTitleHandler(req, reply);
      }
    }
  }
};

const decodeBase64Image = require('../../helpers/decodebase64image');
const { getImage } = require('../../dbrequests/images');

// Send Raw Image
const sendRawImage = (req, reply) => {
  getImage(req.params.url, (err, image) => {
    if (err) reply(err);
    else if (!image) reply('Image Not Found');
    else {
      image = decodeBase64Image(image.imagebody);
      reply(image.data).header('content-type', image.type);
    }
  });
};

module.exports = {
  path: '/image/{url}',
  method: 'get',
  config: {
    cache: {
      expiresIn: 2000 * 1000,
      privacy: 'private'
    }
  },
  handler: (req, reply) => {
    sendRawImage(req, reply);
  }
};

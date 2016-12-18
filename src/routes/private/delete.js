const deleteImage = require('../../dbrequests/delete').deleteImage;
const unlinkImage = require('../../helpers/image-helpers').unlinkImage;

const removeImageRoute = (payload, req, reply) => {
  let imageurl = payload.imageurl;
  unlinkImage(imageurl, (err) => {
    err ? reply(`db delete: 0, images/ delete: 0`) : deleteImage(imageurl, (err) => {
      err ? reply(`db delete: 1, images/ delete: 0`) : reply(`${imageurl} deleted`);
    });
  });
};

// const delete

module.exports = {
  path: '/delete',
  method: 'post',
  handler: (req, reply) => {
    let payload = JSON.parse(req.payload);
    if (payload.item === 'image') {
      removeImageRoute(payload, req, reply);
    }
  }
};

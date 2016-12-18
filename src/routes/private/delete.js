const deleteImageFromDb = require('../../dbrequests/delete').deleteImage;
const deleteImage = require('../../helpers/image-helpers').deleteImage;

module.exports = {
  path: '/delete',
  method: 'post',
  handler: (req, reply) => {
    let payload = JSON.parse(req.payload);
    if (payload.item === 'image') {
      let imageurl = payload.imageurl;
      deleteImageFromDb(imageurl, (err) => {
        err ? reply(err) : deleteImage(imageurl, (err) => {
          err ? reply(err) : reply(`${imageurl} deleted`);
        });
      });
    }
  }
};

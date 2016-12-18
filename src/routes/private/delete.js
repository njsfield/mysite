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
        err ? reply(`db delete: 0, images/ delete: 0`) : deleteImage(imageurl, (err) => {
          err ? reply(`db delete: 1, images/ delete: 0`) : reply(`${imageurl} deleted`);
        });
      });
    }
  }
};

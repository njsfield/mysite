const {deleteImage, deletePost} = require('../../dbrequests/delete');
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
  path: '/delete/{id*}',
  method: ['get', 'post'],
  handler: (req, reply) => {
    if (req.method === 'post') {
      let payload = JSON.parse(req.payload);
      if (payload.item === 'image') {
        removeImageRoute(payload, req, reply);
      }
    } else {
      deletePost(req.params.id, (err) => {
        err ? reply(`error deleting post`) : reply.redirect('/blog');
      });
    }
  }
};

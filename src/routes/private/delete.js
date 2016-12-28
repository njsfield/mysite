const {deleteImage, deletePost} = require('../../dbrequests/delete');

const removeImageFromDb = (req, reply) => {
  let imageurl = req.payload.imageurl;
  deleteImage(imageurl, (err) => {
    err ? reply(`db delete: 1`) : reply(`${imageurl} deleted`);
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
        removeImageFromDb(req, reply);
      }
    } else {
      deletePost(req.params.id, (err) => {
        err ? reply(`error deleting post`) : reply.redirect('/blog');
      });
    }
  }
};

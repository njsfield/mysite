const {deleteImage, deletePost} = require('../../dbrequests/delete');
const credentialsCheck = require('../../helpers/credentialscheck');

const removeImageFromDb = (req, reply) => {
  if (!credentialsCheck(req)) {
    reply('Not Authorized');
  } else {
    let payload = JSON.parse(req.payload);
    let imageurl = payload.imageurl;
    deleteImage(imageurl, (err) => {
      err ? console.log('Failed to delete Image from DB') : reply(`${imageurl} deleted`);
    });
  }
};

const deletePostFromDb = (req, reply) => {
  if (!credentialsCheck(req)) {
    reply('Not Authorized');
  } else {
    deletePost(req.params.id, (err) => {
      err ? console.log('Failed to delete post from DB') : reply.redirect('/blog');
    });
  }
};

// const delete

module.exports = {
  path: '/delete/{id*}',
  method: ['get', 'post'],
  config: {
    auth: {
      strategy: 'session',
      mode: 'try'
    },
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    handler: (req, reply) => {
      if (req.method === 'post') {
        removeImageFromDb(req, reply);
      } else {
        deletePostFromDb(req, reply);
      }
    }
  }
};

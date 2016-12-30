const {deleteImage, deletePost} = require('../../dbrequests/delete');
const credentialsCheck = require('../../helpers/credentialscheck');

const deleteImageFromDb = (req, reply) => {
  if (!credentialsCheck(req)) {
    reply('Not Authorized');
  } else {
    let payload = JSON.parse(req.payload);
    let imageurl = payload.imageurl;
    deleteImage(imageurl, (err) => {
      err ? reply(err) : reply(`${imageurl} deleted`);
    });
  }
};

const deletePostFromDb = (req, reply) => {
  if (!credentialsCheck(req)) {
    reply('Not Authorized');
  } else {
    deletePost(req.params.id, (err) => {
      err ? reply(err) : reply.redirect('/blog');
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
        deleteImageFromDb(req, reply);
      } else {
        deletePostFromDb(req, reply);
      }
    }
  }
};

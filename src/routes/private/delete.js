const {deleteImage, deletePost} = require('../../dbrequests/delete');
const credentialsCheck = require('../../helpers/credentialscheck');

const deleteImageFromDb = (req, reply) => {
  if (!credentialsCheck(req)) {
    reply.redirect('/');
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
    reply.redirect('/');
  } else {
    deletePost(req.params.uri, (err) => {
      err ? reply(err) : reply.redirect('/blog');
    });
  }
};

// const delete

module.exports = {
  path: '/delete/{uri*}',
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

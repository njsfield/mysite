const {deleteImage, deletePost} = require('../../dbrequests/delete');
const credentialsCheck = require('../../helpers/credentialscheck');
const notJson = JSON.parse;
const authError = new Error('Not Authorized');

// If post method, then image gets deleted
const deleteImageFromDb = (req, reply) => {
  (!credentialsCheck(req)) ? reply(authError) : deleteImage(notJson(req.payload).imageurl, (err) => {
    err ? reply(err) : reply(`${notJson(req.payload).imageurl} deleted`);
  });
};

// If get method, then post gets deleted
const deletePostFromDb = (req, reply) => {
  (!credentialsCheck(req)) ? reply(authError) : deletePost(req.params.id, (err) => {
    err ? reply(err) : reply.redirect('/blog');
  });
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

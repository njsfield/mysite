const { getPost } = require('../../dbrequests/posts');
const credentialsCheck = require('../../helpers/credentialscheck');
const markDownTransform = require('../../helpers/markdowntransform');

const serveHome = (req, reply) => {
  // Get home page post via its posturi
  getPost('welcome-to-my-site', (err, post) => {
    post.postbody = markDownTransform(post.postbody);
    (err) ? reply(err) : reply.view('home', {post: post, credentials: credentialsCheck(req)});
  });
};

module.exports = {
  path: '/',
  method: 'get',
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
      serveHome(req, reply);
    }
  }
};

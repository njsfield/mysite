const getPost = require('../../dbrequests/getpost');
const credentialsCheck = require('../../helpers/credentialscheck');
const markDownTransform = require('../../helpers/markdowntransform');

const serveHome = (req, reply) => {
  getPost(1, (err, post) => {
    post.postbody = markDownTransform(post.postbody);
    if (err) throw err;
    reply.view('home', {
      post: post,
      credentials: credentialsCheck(req)
    });
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

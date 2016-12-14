const getPost = require('../dbrequests/getpost');
const credentialsCheck = require('../helpers/credentialscheck');
const markDownTransform = require('../helpers/markdowntransform');

module.exports = {
  path: '/',
  method: 'get',
  config: {
    auth: {
      strategy: 'session',
      mode: 'try'
    },
    handler: (req, reply) => {
      getPost(1, (err, post) => {
        post.postbody = markDownTransform(post.postbody);
        if (err) throw err;
        reply.view('home', {
          post: post,
          credentials: credentialsCheck(req)
        });
      });
    }
  }
};

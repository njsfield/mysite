const getPost = require('../../dbrequests/getpost');
const credentialsCheck = require('../../helpers/credentialscheck');

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
        if (err) throw err;
        reply.view('home', {
          post: post,
          credentials: credentialsCheck(req)
        });
      });
    }
  }
};

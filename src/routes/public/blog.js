const getPosts = require('../../dbrequests/posts.js').getPosts;
const credentialsCheck = require('../../helpers/credentialscheck');

module.exports = {
  path: '/blog/{id*}',
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
      getPosts((err, posts) => {
        err ? reply(err) : reply.view('blog', {
          posts: posts,
          credentials: credentialsCheck(req)
        });
      });
    }
  }
};

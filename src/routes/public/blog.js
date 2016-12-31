const { getPost, getPosts } = require('../../dbrequests/posts.js');
const credentialsCheck = require('../../helpers/credentialscheck');
const markDownTransform = require('../../helpers/markdowntransform');

// Get post via url, prepare markdown and send with credentials
const preparePostAndSend = (req, reply) => {
  getPost(req.params.uri, (err, post) => {
    // Transform markdown into HTML
    post.postbody = markDownTransform(post.postbody);
    err ? reply(err) : reply.view('post', {post: post, credentials: credentialsCheck(req)});
  });
};

// Get posts and send with credentials
const preparePostsAndSend = (req, reply) => {
  getPosts((err, posts) => {
    err ? reply(err) : reply.view('blog', {posts: posts, credentials: credentialsCheck(req)});
  }
);
};

module.exports = {
  path: '/blog/{uri*}',
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
      if (req.params.uri) {
        preparePostAndSend(req, reply);
      } else {
        preparePostsAndSend(req, reply);
      }
    }
  }
};

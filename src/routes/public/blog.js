const { getPost, getPosts } = require('../../dbrequests/posts.js');
const credentialsCheck = require('../../helpers/credentialscheck');
const markDownTransform = require('../../helpers/markdowntransform');

// Custom Error for post
const nullPostError = {
  errorTitle: 'NEEDZ MORE POST',
  statusCode: 404,
  errorMessage: 'Sorry dear, I just checked and I think that post does not exist. It could though, one day...'
};

// Get post via url, prepare markdown and send with credentials
const preparePostAndSend = (req, reply) => {
  let posturi = req.params.uri;
  getPost(posturi, (err, post) => {
    post ? post.postbody = markDownTransform(post.postbody) : err = true;
    err ? reply.view('error', nullPostError).code(404) : reply.view('post', {post: post, credentials: credentialsCheck(req)});
  });
};

// Get posts and send with credentials
const preparePostsAndSend = (req, reply) => {
  getPosts((err, posts) => {
    posts.forEach(post => { post.postbody = `${post.postbody.substring(0, 200)}...`; });
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

const { getPost, getPortfolioItems } = require('../../dbrequests/posts.js');
const credentialsCheck = require('../../helpers/credentialscheck');
const markDownTransform = require('../../helpers/markdowntransform');

// Get post via url, prepare markdown and send with credentials
const preparePostAndSend = (req, reply) => {
  let posturi = req.params.uri;
  getPost(posturi, (err, post) => {
    post.postbody = markDownTransform(post.postbody);
    err ? reply(err) : reply.view('post', {post: post, credentials: credentialsCheck(req)});
  });
};

// Get portfolio posts and send with credentials
const preparePortfolioItemsAndSend = (req, reply) => {
  getPortfolioItems((err, posts) => {
    err ? reply(err) : reply.view('portfolio', {posts: posts, credentials: credentialsCheck(req)});
  }
);
};

module.exports = {
  path: '/portfolio/{uri*}',
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
      if (req.params.url) {
        preparePostAndSend(req, reply);
      } else {
        preparePortfolioItemsAndSend(req, reply);
      }
    }
  }
};

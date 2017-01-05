const { getPost, getPortfolioItems } = require('../../dbrequests/posts.js');
const credentialsCheck = require('../../helpers/credentialscheck');
const markDownTransform = require('../../helpers/markdowntransform');

// Custom Error for post
const nullPortfolioPostError = {
  errorTitle: 'This Project... I did not embark upon',
  statusCode: 404,
  errorMessage: 'So I was having a look through my past work records, trying to please YOU (again), and guess what... you made it up... AGAIN'
};

// Get post via url, prepare markdown and send with credentials
const preparePostAndSend = (req, reply) => {
  let posturi = req.params.uri;
  getPost(posturi, (err, post) => {
    post ? post.postbody = markDownTransform(post.postbody) : err = true;
    err ? reply.view('error', nullPortfolioPostError).code(404) : reply.view('post', {post: post, credentials: credentialsCheck(req)});
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
      if (req.params.uri) {
        preparePostAndSend(req, reply);
      } else {
        preparePortfolioItemsAndSend(req, reply);
      }
    }
  }
};

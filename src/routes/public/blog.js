const { getPost, getPosts } = require('../../dbrequests/posts.js');
const credentialsCheck = require('../../helpers/credentialscheck');
const markDownTransform = require('../../helpers/markdowntransform');

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
      if (req.params.id) {
        let postid = req.params.id;
        getPost(postid, (err, post) => {
          post.postbody = markDownTransform(post.postbody);
          err ? reply(err) : reply.view('post', {post: post, credentials: credentialsCheck(req)});
        });
      } else {
        getPosts((err, posts) => {
          err ? reply(err) : reply.view('blog', {posts: posts, credentials: credentialsCheck(req)});
        }
      );
      }
    }
  }
};

const getPosts = require('../../dbrequests/posts.js').getPosts;

module.exports = {
  path: '/blog/{id*}',
  method: 'get',
  handler: (req, reply) => {
    getPosts((err, posts) => {
      err ? reply(err) : reply.view('blog', {posts: posts});
    });
  }
};

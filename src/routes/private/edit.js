const { getPost } = require('../../dbrequests/posts');
const getCategories = require('../../dbrequests/getcategories');
const updatePost = require('../../dbrequests/updatepost');

// Get Post contents via uri, send contents
const sendPostContentsToEdit = (req, reply) => {
  let posturi = req.params.uri;
  getPost(posturi, (err, post) => {
    if (err) reply(err);
    getCategories((err, categories) => {
      if (err) reply(err);
      if (post.postid === 1) post.homepost = true;
      reply.view('edit', {post: post, categories: categories});
    });
  });
};

// Update post to DB and redirect
const updatePostToDb = (req, reply) => {
  let payload = req.payload;
  payload.live = payload.live === 'on';
  updatePost(payload, (err, data) => {
    err ? reply(err) : reply.redirect(`/blog/${payload.posturi}`);
  });
};

module.exports = {
  path: '/edit/{uri}',
  method: ['get', 'post'],
  config: {
    auth: {
      strategy: 'session',
      mode: 'try'
    },
    handler: (req, reply) => {
      if (req.method === 'get') {
        sendPostContentsToEdit(req, reply);
      } else {
        updatePostToDb(req, reply);
      }
    }
  }
};

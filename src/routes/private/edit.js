const { getPost } = require('../../dbrequests/posts');
const getCategories = require('../../dbrequests/getcategories');
const updatePost = require('../../dbrequests/updatepost');
const growObj = require('../../helpers/growobj');

// Get Post contents via uri, send contents
const sendPostContentsToEdit = (req, reply) => {
  getPost(req.params.uri, (err, post) => {
    (err) ? reply(err) : getCategories((err, categories) => {
      (err) ? reply(err) : reply.view('edit', {post: growObj(post, 'homepost', post.postid === 1), categories: categories});
    });
  });
};

// Update post to DB and redirect
const updatePostToDb = (req, reply) => {
  let payload = growObj(req.payload, 'live', req.payload.live === 'on');
  payload = growObj(payload, 'posturi', req.params.uri);
  updatePost(payload, (err) => {
    (err) ? reply(err) : reply.redirect(`/blog/${payload.posturi}`);
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

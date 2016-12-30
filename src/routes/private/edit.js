const { getPost } = require('../../dbrequests/posts');
const getCategories = require('../../dbrequests/getcategories');
const updatePost = require('../../dbrequests/updatepost');

// Get Post contents via uri, send contents
const sendPostContentsToEdit = (req, reply) => {
  let posturi = req.params.uri;
  getPost(posturi, (err, post) => {
    if (err) throw err;
    getCategories((err, categories) => {
      if (err) throw err;
      if (post.postid === 1) post.homepost = true;
      reply.view('edit', {post: post, categories: categories});
    });
  });
};

// Update post to DB and redirect
const updatePostToDb = (req, reply) => {
  let payload = req.payload;
  payload.live = payload.live === 'on';
  payload.posturi = req.params.uri;
  updatePost(payload, (err) => {
    if (err) throw err;
    let uri = `/blog/${payload.posturi}`;
    reply.redirect(uri);
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

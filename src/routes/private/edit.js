const getPost = require('../../dbrequests/getpost');
const getCategories = require('../../dbrequests/getcategories');
const updatePost = require('../../dbrequests/updatepost');

module.exports = {
  path: '/edit/{id}',
  method: ['get', 'post'],
  config: {
    auth: {
      strategy: 'session',
      mode: 'try'
    },
    handler: (req, reply) => {
      if (req.method === 'get') {
        getPost(1, (err, post) => {
          if (err) throw err;
          getCategories((err, categories) => {
            if (err) throw err;
            reply.view('edit', {post: post, categories: categories});
          });
        });
      } else {
        updatePost(req.payload, (err) => {
          if (err) throw err;
          let postid = req.url.path.slice(-1);
          let uri = postid === '1' ? '/' : `/blog/${postid}`;
          reply.redirect(uri);
        });
      }
    }
  }
};

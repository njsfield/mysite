const getCategories = require('../../dbrequests/getcategories');
const createPost = require('../../dbrequests/createpost');

module.exports = {
  path: '/compose',
  method: ['get', 'post'],
  config: {
    auth: {
      strategy: 'session',
      mode: 'try'
    },
    handler: (req, reply) => {
      if (req.method === 'get') {
        getCategories((err, categories) => {
          err ? reply(err) : reply.view('compose', {categories: categories});
        });
      } else {
        let payload = req.payload;
        payload.live = payload.live === 'on';
        createPost(payload, (err) => {
          if (err) throw err;
          reply.redirect('/blog');
        });
      }
    }
  }
};

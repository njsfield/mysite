const getCategories = require('../../dbrequests/getcategories');

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
      }
    }
  }
};

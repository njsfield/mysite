const {sanitizeURI, prepareURIForDb} = require('../../helpers/uri-helpers');
const growObj = require('../../helpers/growobj');
const getCategories = require('../../dbrequests/getcategories');
const createPost = require('../../dbrequests/createpost');
const { getPosts } = require('../../dbrequests/posts');

// Get Catgegories from DB, then reply with them in view
const replyWithCategories = (req, reply) => {
  getCategories((err, categories) => {
    err ? reply(err) : reply.view('compose', {categories: categories});
  });
};

// Prepare new post by creating sanitized URI, then adding post to db
const prepareNewPost = (req, reply) => {
  let payload = growObj(req.payload, 'live', req.payload.live === 'on');
  prepareURIForDb(sanitizeURI(payload.posttitle), getPosts, 'posturi', (err, newUri) => {
    (err) ? reply(err) : createPost(growObj(payload, 'posturi', newUri), (err) => {
      (err) ? reply(err) : reply.redirect('/blog');
    });
  });
};

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
        replyWithCategories(req, reply);
      } else {
        prepareNewPost(req, reply);
      }
    }
  }
};

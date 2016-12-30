const {sanitizeURI, prepareURIForDb} = require('../../helpers/uri-helpers');
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
  let payload = req.payload;
  payload.live = payload.live === 'on';
  let uri = sanitizeURI(payload.posttitle);
  prepareURIForDb(uri, getPosts, 'posturi', (err, newUri) => {
    if (err) throw err;
    else {
      payload.posturi = newUri;
      createPost(payload, (err) => {
        if (err) throw err;
        else {
          reply.redirect('/blog');
        }
      });
    }
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

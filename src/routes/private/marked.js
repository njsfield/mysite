const markDownTransform = require('../../helpers/markdowntransform');

module.exports = {
  path: '/marked',
  method: 'post',
  config: {
    auth: {
      strategy: 'session',
      mode: 'try'
    },
    handler: (req, reply) => {
      let marked = req.payload === 'NULL' ? '' : markDownTransform(req.payload);
      reply(JSON.stringify({marked: marked}));
    }
  }
};

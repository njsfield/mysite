const markDownTransform = require('../../helpers/markdowntransform');
const makeJson = JSON.stringify;

module.exports = {
  path: '/marked',
  method: 'post',
  config: {
    auth: {
      strategy: 'session',
      mode: 'try'
    },
    handler: (req, reply) => {
      reply(makeJson({marked: markDownTransform(req.payload)}));
    }
  }
};

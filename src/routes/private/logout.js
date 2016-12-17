module.exports = {
  path: '/logout',
  method: 'get',
  config: {
    auth: {
      strategy: 'session',
      mode: 'try'
    },
    handler: (req, reply) => {
      req.cookieAuth.clear();
      reply.redirect('/');
    }
  }

};

module.exports = {
  path: '/',
  method: 'get',
  config: {
    auth: {
      strategy: 'session',
      mode: 'try'
    },
    handler: (req, reply) => {
      reply.view('home', { credentials: req.auth.credentials });
    }
  }
};

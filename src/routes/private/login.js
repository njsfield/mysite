module.exports = {
  path: '/login',
  method: ['post', 'get'],
  handler: (req, reply) => {
    reply.view('login');
  }
};

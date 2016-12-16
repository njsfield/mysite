module.exports = {
  path: '/logout',
  method: 'get',
  handler: (req, reply) => {
    reply.view('logout');
  }
};

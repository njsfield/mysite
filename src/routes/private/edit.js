module.exports = {
  path: '/edit/{id}',
  method: ['get', 'put'],
  handler: (req, reply) => {
    reply.view('/');
  }
};

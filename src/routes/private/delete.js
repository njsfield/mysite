module.exports = {
  path: '/delete/{id}',
  method: ['delete'],
  handler: (req, reply) => {
    reply.view('/');
  }
};

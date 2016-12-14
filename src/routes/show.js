module.exports = {
  path: '/show/{id}',
  method: 'put',
  handler: (req, reply) => {
    reply.view('/');
  }
};

module.exports = {
  path: '/hide/{id}',
  method: 'put',
  handler: (req, reply) => {
    reply.view('/');
  }
};

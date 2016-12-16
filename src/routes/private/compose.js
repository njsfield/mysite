module.exports = {
  path: '/compose',
  method: ['get', 'post'],
  handler: (req, reply) => {
    reply.view('/');
  }
};

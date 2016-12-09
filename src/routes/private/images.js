module.exports = {
  path: '/images',
  method: ['get', 'post'],
  handler: (req, reply) => {
    reply.view('/');
  }
};

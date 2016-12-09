module.exports = {
  path: '/portfolio/{id*}',
  method: 'get',
  handler: (req, reply) => {
    reply.view('portfolio');
  }
};

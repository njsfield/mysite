module.exports = {
  path: '/blog/{id*}',
  method: 'get',
  handler: (req, reply) => {
    reply.view('blog');
  }
};

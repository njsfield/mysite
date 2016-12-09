module.exports = {
  path: '/',
  method: 'get',
  handler: (req, reply) => {
    reply.view('home');
  }
};

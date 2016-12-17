const fs = require('fs');
const path = require('path');

module.exports = {
  path: '/images',
  method: ['get', 'post'],
  handler: (req, reply) => {
    if (req.method === 'get') {
      fs.readdir(path.join(__dirname, '../../../public/images'), (err, images) => {
        if (err) throw err;
        reply({images: images});
      });
    } else {
      reply.redirect('/');
    }
  }
};

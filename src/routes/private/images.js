const fs = require('fs');
const path = require('path');

const decodeBase64Image = (dataString) => {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
};

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
      let imageBuffer = decodeBase64Image(req.payload);
      let imageName = req.query.name;
      fs.writeFile(path.join(__dirname, '../../../public/images', imageName), imageBuffer.data, (err) => {
        if (err) throw err;
        reply('done');
      });
    }
  }
};

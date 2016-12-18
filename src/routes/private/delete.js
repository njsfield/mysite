const {deleteImage} = require('../../dbrequests/delete');
const fs = require('fs');
const path = require('path');

module.exports = {
  path: '/delete',
  method: 'post',
  handler: (req, reply) => {
    let payload = JSON.parse(req.payload);
    if (payload.item === 'image') {
      let imageurl = payload.imageurl;
      deleteImage(imageurl, (err) => {
        if (err) reply(err);
        else {
          fs.unlink(path.join(__dirname, '../../../public/images', imageurl), (err) => {
            err ? reply(err) : reply(`${imageurl} deleted`);
          });
        }
      });
    }
  }
};

const dbConn = require('../dbconnection.js');

const updateImageQuery = `Update images SET imagetitle = $1 WHERE imageurl = $2;`;

const updateImage = (imagetitle, imageurl, cb) => {
  dbConn.query(updateImageQuery, [imagetitle, imageurl], (err, data) => {
    (err) ? cb(err) : cb(null);
  });
};

module.exports = updateImage;

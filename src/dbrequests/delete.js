const dbConn = require('../dbconnection.js');

const deleteImage = (imageurl, cb) => {
  dbConn.query(`DELETE FROM images WHERE imageurl = $1`, [imageurl], (err, data) => {
    (err ? cb(err) : cb(null));
  });
};

const deletePost = (posturi, cb) => {
  dbConn.query(`DELETE FROM posts WHERE posturi = $1;`, [posturi], (err, data) => {
    (err ? cb(err) : cb(null));
  });
};

module.exports = {
  deleteImage,
  deletePost
};

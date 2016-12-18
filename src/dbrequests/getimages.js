const dbConn = require('../dbconnection.js');

const getImage = (imageurl, cb) => {
  dbConn.query(`SELECT * FROM images WHERE imageurl = $1`, [imageurl], (err, data) => {
    (err ? cb(err) : cb(null, data.rows[0]));
  });
};

const getImages = (cb) => {
  dbConn.query(`SELECT * FROM images`, (err, data) => {
    (err ? cb(err) : cb(null, data.rows[0]));
  });
};

module.exports = {
  getImage,
  getImages
};

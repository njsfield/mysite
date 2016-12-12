const dbConn = require('../dbconnection.js');

const getImage = (imageid, cb) => {
  dbConn.query(`SELECT * FROM images WHERE imageid = $1`, [imageid], (err, data) => {
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

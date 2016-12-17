const dbConn = require('../dbconnection.js');

const query = `INSERT INTO images (imageurl, imagetitle, uploaddate) VALUES
($1, 'Custom Upload', CURRENT_DATE);`;

module.exports = (imagename, cb) => {
  dbConn.query(query, [imagename], (err, data) => {
    (err ? cb(err) : cb(null));
  });
};

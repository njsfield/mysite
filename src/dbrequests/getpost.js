const dbConn = require('../dbconnection.js');

module.exports = (postid, cb) => {
  dbConn.query(`SELECT * FROM posts INNER JOIN postbodies ON postbodies.postid = $1`, [postid], (err, data) => {
    (err ? cb(err) : cb(null, data.rows[0]));
  });
};

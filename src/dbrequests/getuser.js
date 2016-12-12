const dbConn = require('../dbconnection.js');

module.exports = (username, cb) => {
  dbConn.query(`SELECT * FROM owners WHERE ownerusername = $1`, [username], (err, data) => {
    (err ? cb(err) : cb(null, data.rows[0]));
  });
};

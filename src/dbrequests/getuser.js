const dbConn = require('../dbconnection.js');

module.exports = (username, cb) => {
  dbConn.query(`SELECT * FROM Owners WHERE OwnerUsername = $1`, [username], (err, data) => {
    (err ? cb(err) : cb(null, data.rows[0]));
  });
};

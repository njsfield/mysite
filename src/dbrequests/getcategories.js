const dbConn = require('../dbconnection.js');

module.exports = (cb) => {
  dbConn.query(`SELECT categoryname FROM categories`, (err, data) => {
    (err ? cb(err) : cb(null, data.rows.reduce((c, b) => {
      c.push(b.categoryname);
      return c;
    }, [])
  ));
  });
};

// Setup //
const env = require('env2');
const fs = require('fs');
const path = require('path');
env('./config.env');

// Use test Database
const dbConn = require('./dbconnection_test.js');

// Read main build database SQL file
const sql = fs.readFileSync(path.join(__dirname, '../../src/database_builder/build_database.sql')).toString();

module.exports = (cb) => {
  dbConn.query(sql, (err) => {
    err ? cb(err) : cb(null);
  });
};

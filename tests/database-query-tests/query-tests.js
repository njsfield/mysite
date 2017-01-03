const test = require('tape');

const env = require('env2');
const fs = require('fs');
const path = require('path');

env('./config.env');

const dbConn = require('./dbconnection_test.js');

const sql = fs.readFileSync(path.join(__dirname, '../../src/database_builder/build_database.sql')).toString();

// Initial Setup
dbConn.query(sql, (error, result) => {
  error ? console.log('Error: ', error) : queryTests();
});

// Query Tests
const queryTests = () => {
  // Basic Build
  test('query build', (t) => {
    dbConn.query('SELECT * FROM posts WHERE postid = 1', (err, data) => {
      t.error(err, 'Should not throw an error');
      t.equal(data.postid, 1, 'Should return postid');
      t.end();
    });
  });
};

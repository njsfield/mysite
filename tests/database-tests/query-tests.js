// Tape //
const test = require('tape');
const buildDb = require('./build_test_database.js');
const dbConnTest = require('./dbconnection_test');

// Override production dbconnection to dbconnection_test
const proxyquire = require('proxyquire');
const dbConnReplace = {'../dbconnection.js': dbConnTest};

const posts = proxyquire('../../src/dbrequests/posts', dbConnReplace);
// const createPost = require('../../src/dbrequests/createpost');
// const del = require('../../src/dbrequests/delete');
// const getCategories = require('../../src/dbrequests/getcategories');
// const getUser = require('../../src/dbrequests/getuser');
// const images = require('../../src/dbrequests/images');

// const updatePost = require('../../src/dbrequests/updatepost');

// Pre Build
buildDb((error) => {
  error ? console.log('Error Building Database: ', error) : queryTests();
});

// Query Tests
const queryTests = () => {
  // Home Page Query
  test('query build', (t) => {
    posts.getPost('welcome-to-my-site', (err, data) => {
      t.error(err, 'Should not throw an error');
      t.equal(data.postid, 1, 'Should return post ID which should always be one');
      t.ok(typeof data.posturi === 'string', 'Should return post uri');
      t.ok(data.postbody.length > 0, 'Postbody should not be empty');
      t.notok(data.live, 'Home post should not be live blog post');
      t.ok(data.ownername, 'njsfield', 'Site owner should be author of home page post');
      t.end();
    });
  });
};

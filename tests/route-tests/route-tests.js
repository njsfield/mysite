// Tape
const test = require('tape');
const buildDb = require('../database-tests/build_test_database.js');
const dbConnTest = require('../database-tests/dbconnection_test');

// Override production dbconnection to dbconnection_test (for mock database purposes)
const proxyquire = require('proxyquire');
const dbConnReplace = {'../dbconnection.js': dbConnTest};

proxyquire('../../src/dbrequests/posts', dbConnReplace);
proxyquire('../../src/dbrequests/createpost', dbConnReplace);
proxyquire('../../src/dbrequests/delete', dbConnReplace);
proxyquire('../../src/dbrequests/getcategories', dbConnReplace);
proxyquire('../../src/dbrequests/getuser', dbConnReplace);
proxyquire('../../src/dbrequests/images', dbConnReplace);

// const updatePost = require('../../src/dbrequests/updatepost');

// Pre Build
buildDb((error) => {
  error ? console.log('Error Building Database: ', error) : routeTests();
});

const server = require('../../src/server.js');

// Tests
const routeTests = () => {
 /************/
 /************/
 /**  Home **/
 /************/
 /************/

// Home (no credentials)
  test('Home route should load content', (t) => {
    let options = {
      method: 'GET',
      url: '/'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should respond with 200 status code');
      t.ok(res.payload, 'Successfully returns payload content');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'View renders html/body tag');
      t.notok(/href="\/edit\/.*"/.test(res.payload), 'With no credentials, should not render edit button');
      t.end();
    });
  });

// Home without credentials
  test('Public home route', (t) => {
    let options = {
      method: 'GET',
      url: '/'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should respond with 200 status code');
      t.notok(/href="\/edit\/.*"/.test(res.payload), 'Without credentials, should NOT render edit button');
      t.end();
    });
  });
  // Home with faulty credentials
  test('Home route (logged in)', (t) => {
    let options = {
      method: 'GET',
      url: '/',
      credentials: {
        current_user: 'john'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should respond with 200 status code');
      t.ok(/href="\/edit\/.*"/.test(res.payload), 'With credentials, should render edit button');
      t.end();
    });
  });

// Home with bad credentials
  test('Home route with faulty credentials', (t) => {
    let options = {
      method: 'GET',
      url: '/',
      credentials: {
        hacker_name: 'devil'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should respond with 200 status code');
      t.notok(/href="\/edit\/.*"/.test(res.payload), 'With faulty credentials, should NOT render edit button');
      t.end();
    });
  });

// Cannot post to home
  test('No posting to Home route', (t) => {
    let options = {
      method: 'POST',
      url: '/',
      payload: {
        evilcode: '(function (evil) { evil()}(badFunc)'
      }
    };
    server.inject(options, (res) => {
      t.ok(res.statusCode, 404, 'Should NOT respond with 200 when attempting post request to home');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'View will still render html/body tag');
      t.end();
    });
  });

  // Blog
  test('No posting to Home route', (t) => {
    let options = {
      method: 'POST',
      url: '/',
      payload: {
        evilcode: '(function (evil) { evil()}(badFunc)'
      }
    };
    server.inject(options, (res) => {
      t.ok(res.statusCode, 404, 'Should NOT respond with 200 when attempting post request to home');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'View will still render html/body tag');
      t.end();
    });
  });
  /************/
  /************/
  /**  Blog **/
  /************/
  /************/

  // Blog no credentials
  test('blog (no credentials)', (t) => {
    let options = {
      method: 'GET',
      url: '/blog'
    };
    server.inject(options, (res) => {
      t.ok(res.statusCode, 200, 'Should respond with 200 status code for blog');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'View render html/body tag');
      t.ok(/<a class="snippet" href="\/blog\/[a-z-]*">/.test(res.payload), 'Should render at least one blog snippet');
      t.notok(/href="\/compose"/.test(res.payload), 'Without credentials, should NOT show compose button');
      t.end();
    });
  });
  // Blog with credentials
  test('blog with credentials', (t) => {
    let options = {
      method: 'GET',
      url: '/blog',
      credentials: {
        current_user: 'john'
      }
    };
    server.inject(options, (res) => {
      t.ok(res.statusCode, 200, 'Should respond with 200 status code for blog');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'View render html/body tag');
      t.ok(/href="\/compose"/.test(res.payload), 'With credentials, should show compose button');
      t.end();
    });
  });
};

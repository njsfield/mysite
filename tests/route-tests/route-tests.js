const test = require('tape');
const server = require('../../src/server.js');

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

// Home with credentials
test('Home route should load content', (t) => {
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

// Home with credentials
test('Home route should load content', (t) => {
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

// Cannot post to home
test('Home route should load content', (t) => {
  let options = {
    method: 'POST',
    url: '/'
  };
  server.inject(options, (res) => {
    t.ok(res.statusCode, 404, 'Should NOT respond with 200 when attempting post request to home');
    t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'View renders html/body tag');
    t.end();
    // t.equal(res.statusCode, 200, 'Should respond with 200 status code');
    // t.ok(/href="\/edit\/.*"/.test(res.payload), 'With credentials, should render edit button');
    // t.end();
  });
});

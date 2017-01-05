// Tape
const test = require('tape');
const buildDb = require('../database-tests/build_test_database.js');
const dbConnTest = require('../database-tests/dbconnection_test');
const env = require('env2');

// Install Environment Variables
env('./config.env');

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
 /**********/
 /**********/
 /** Home **/
 /**********/
 /**********/

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
      t.equal(res.statusCode, 404, 'Should NOT respond with 200 when attempting post request to home');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'View will still render html/body tag');
      t.end();
    });
  });
  /**********/
  /**********/
  /** Blog **/
  /**********/
  /**********/

  // Blog no credentials
  test('blog (no credentials)', (t) => {
    let options = {
      method: 'GET',
      url: '/blog'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should respond with 200 status code for blog');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'View render html/body tag');
      t.ok(/<a class="snippet" href="\/blog\/[a-z-]*">/.test(res.payload), 'Should render at least one blog snippet');
      t.notok(/href="\/compose"/.test(res.payload), 'Without credentials, should NOT show compose button');
      t.notok(/NOT LIVE/.test(res.payload), 'Without credentials, should not show NOT LIVE warning');
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
      t.equal(res.statusCode, 200, 'Should respond with 200 status code for blog');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'View render html/body tag');
      t.ok(/href="\/compose"/.test(res.payload), 'With credentials, should show compose button');
      t.ok(/NOT LIVE/.test(res.payload), 'With credentials, should show NOT LIVE warning for home post');
      t.end();
    });
  });
  // Blog URI
  test('blog URI', (t) => {
    let options = {
      method: 'GET',
      url: '/blog/markdown-style-guide'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should respond with 200 status code for blog');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'View renders html/body tag');
      t.ok(/<h1 class="post__header">.+<\/h1>/.test(res.payload), 'Should render header tag');
      t.ok(/<h5 class="post__date">\d{2} - \d{2} - \d{4}<\/h5>/.test(res.payload), 'Should render date correctly');
      t.ok(/<div class="post__body">(.|\n)*<\/div>/.test(res.payload), 'Should render postbody');
      t.notok(/```javascript /.test(res.payload), 'Should NOT render markdown syntax');
      t.notok(/href="\/edit"/.test(res.payload), 'Without credentials, should NOT show edit button');
      t.end();
    });
  });
  // Blog URI with credentials
  test('blog URI (with credentials)', (t) => {
    let options = {
      method: 'GET',
      url: '/blog/markdown-style-guide',
      credentials: {
        current_user: 'john'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should respond with 200 status code for blog');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'View renders html/body tag');
      t.ok(/href="\/edit\/markdown-style-guide"/.test(res.payload), 'With credentials, should show edit button for this post');
      t.end();
    });
  });
  // Not existent post
  test('Blog URI (non-existent)', (t) => {
    let options = {
      method: 'GET',
      url: '/blog/non-existent-post'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 404, 'Should respond with 404 if post not found');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'Still renders HTML');
      t.ok(/NEEDZ MORE POST/.test(res.payload), 'Should display custom error');
      t.end();
    });
  });
  /**************/
  /**************/
  /* Portfolio **/
  /**************/
  /**************/

  // Portfolio no credentials
  test('Portfolio (no credentials)', (t) => {
    let options = {
      method: 'GET',
      url: '/portfolio'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should respond with 200 status code for portfolio');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'View render html/body tag at least');
      t.notok(/href="\/compose"/.test(res.payload), 'Without credentials, should NOT show compose button');
      t.end();
    });
  });
  // Portfolio with credentials
  test('Portfolio with credentials', (t) => {
    let options = {
      method: 'GET',
      url: '/portfolio',
      credentials: {
        current_user: 'john'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should respond with 200 status code for portfolio');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'View render html/body tag');
      t.ok(/href="\/compose"/.test(res.payload), 'With credentials, should show compose button');
      t.end();
    });
  });
  // Not existent portfolio post
  test('portfolio URI (non existent)', (t) => {
    let options = {
      method: 'GET',
      url: '/portfolio/non-existent-post'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 404, 'Should respond with 404 if portfolio post not found');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'Still renders HTML');
      t.ok(/This Project\.\.\. I did not embark upon/.test(res.payload), 'Should display custom error');
      t.end();
    });
  });
  /***********/
  /***********/
  /** Login **/
  /***********/
  /***********/

  // Login
  test('Login (get)', (t) => {
    let options = {
      method: 'GET',
      url: '/login'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should respond with 200 status code for portfolio');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'View render html/body tag');
      t.ok(/Please Kindly Log In/.test(res.payload), 'Should display prompt to log in');
      t.ok(/<form class="login" action="\/login" method="post"/.test(res.payload), 'Should display form to fill in details');
      t.end();
    });
  });
  // Login (false username)
  test('Login (false username)', (t) => {
    let options = {
      method: 'POST',
      url: '/login',
      payload: {
        username: 'john',
        password: 'secret'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should still respond with 200 status code for loggin in if false username');
      t.ok(/Non existent user/.test(res.payload), 'Should display Non existent user if user not found');
      t.end();
    });
  });
  // Login (false password)
  test('Login (false password)', (t) => {
    let options = {
      method: 'POST',
      url: '/login',
      payload: {
        username: process.env.DB_USERNAME,
        password: 'wrongpassword'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should still respond with 200 status code for loggin in if false password');
      t.ok(/Wrong password/.test(res.payload), 'Should display Wrong password if password doesnt match');
      t.end();
    });
  });
  // Login (successful credentials)
  test('Login (false password)', (t) => {
    let options = {
      method: 'POST',
      url: '/login',
      payload: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 302, 'Should redirect on login');
      t.equal(res.headers['location'], '/', 'Should redirect to home');
      t.ok(res.headers['set-cookie'], 'Should set cookie in header after successful login');
      t.end();
    });
  });
  /************/
  /************/
  /** Logout **/
  /************/
  /************/

  // Logout
  test('Login (removes credentials)', (t) => {
    let options = {
      method: 'GET',
      url: '/logout',
      credentials: {
        current_user: 'john'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 302, 'Should redirect on logout');
      t.equal(res.headers['location'], '/', 'Should redirect to home');
      t.ok(/somecookie=; Max-Age=0;/.test(res.headers['set-cookie'][0]), 'Should set client cookie to null');
      t.end();
    });
  });
  // Logout (without credentials)
  test('Login (without credentials)', (t) => {
    let options = {
      method: 'GET',
      url: '/logout'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 302, 'Should still redirect on logout');
      t.equal(res.headers['location'], '/', 'Should redirect to home');
      t.end();
    });
  });
  /************/
  /************/
  /** Marked **/
  /************/
  /************/

  // Marked with post
  test('Marked payload post', (t) => {
    let options = {
      method: 'post',
      url: '/marked',
      headers: {
        'content-type': 'text/plain;charset=UTF-8'
      },
      credentials: {
        current_user: 'john'
      },
      payload: '## Hello'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should respond with status code of 200');
      t.ok(JSON.parse(res.payload), 'Response is sent as JSON object');
      let html = JSON.parse(res.payload).marked;
      t.ok(/<h2/.test(html), 'Response contains html');
      t.ok(/Hello/.test(html), 'Response contains original string');
      t.notok(/##/.test(html), 'Response does not contain markdown');
      t.end();
    });
  });

  // Marked with no credentials
  test('Marked payload post (no credentials)', (t) => {
    let options = {
      method: 'post',
      url: '/marked',
      headers: {
        'content-type': 'text/plain;charset=UTF-8'
      },
      payload: '## Hello'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 302, 'Should redirect without credentials');
      t.equal(res.headers['location'], '/', 'Should redirect to home');
      t.end();
    });
  });
  // Marked with no 'NULL' as payload
  test('Marked payload (empty post)', (t) => {
    let options = {
      method: 'post',
      url: '/marked',
      headers: {
        'content-type': 'text/plain;charset=UTF-8'
      },
      credentials: {
        current_user: 'john'
      },
      payload: 'NULL'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should still respond with status code of 200');
      t.ok(JSON.parse(res.payload), 'Response is sent as JSON object');
      let html = JSON.parse(res.payload).marked;
      t.notok(html, 'Marked response in payload should be empty');
      t.end();
    });
  });
  /***************/
  /***************/
  /** Add Image **/
  /***************/
  /***************/

  // No credentials
  test('Add Image (no credentials)', (t) => {
    let options = {
      method: 'post',
      url: '/addimage?name=image1.jpg',
      headers: {
        'content-type': 'text/plain;charset=UTF-8'
      },
      payload: 'data:image/jpeg;base64,/9j/4Qj1RXhpZgAA'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 302, 'Should redirect without credentials');
      t.equal(res.headers['location'], '/', 'Should redirect to home');
      t.end();
    });
  });
  // Saving an image
  test('Add Image (with credentials)', (t) => {
    let options = {
      method: 'post',
      url: '/addimage?name=image1.jpg',
      headers: {
        'content-type': 'text/plain;charset=UTF-8'
      },
      credentials: {
        current_user: 'john'
      },
      payload: 'data:image/jpeg;base64,/9j/4Qj1RXhpZgAA'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should still respond with status code of 200');
      t.equal(res.payload, 'done', 'Should give "done message" when complete');
      t.end();
    });
  });
  /************/
  /************/
  /** Images **/
  /************/
  /************/
  // // No credentials
  // test('Add Image (no credentials)', (t) => {
  //   let options = {
  //     method: 'post',
  //     url: '/addimage?name=image1.jpg',
  //     headers: {
  //       'content-type': 'text/plain;charset=UTF-8'
  //     },
  //     payload: 'data:image/jpeg;base64,/9j/4Qj1RXhpZgAA'
  //   };
  //   server.inject(options, (res) => {
  //     t.equal(res.statusCode, 302, 'Should redirect without credentials');
  //     t.equal(res.headers['location'], '/', 'Should redirect to home');
  //     t.end();
  //   });
  // });
  // // Saving an image
  // test('Add Image (with credentials)', (t) => {
  //   let options = {
  //     method: 'post',
  //     url: '/addimage?name=image1.jpg',
  //     headers: {
  //       'content-type': 'text/plain;charset=UTF-8'
  //     },
  //     credentials: {
  //       current_user: 'john'
  //     },
  //     payload: 'data:image/jpeg;base64,/9j/4Qj1RXhpZgAA'
  //   };
  //   server.inject(options, (res) => {
  //     t.equal(res.statusCode, 200, 'Should still respond with status code of 200');
  //     t.equal(res.payload, 'done', 'Should give "done message" when complete');
  //     t.end();
  //   });
  // });
};

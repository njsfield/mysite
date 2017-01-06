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
proxyquire('../../src/dbrequests/updatepost', dbConnReplace);

// const updatePost = require('../../src/dbrequests/updatepost');

// Pre Build
buildDb((error) => {
  error ? console.log('Error Building Database: ', error) : routeTests();
});

const server = require('../../src/server.js');
const categoryColor = require('../../views/helpers/categorycolor');
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

  // Send Raw Image
  test('Send Raw Image', (t) => {
    let options = {
      method: 'get',
      url: '/images/image1.jpg'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should respond with status code of 200');
      t.equal(res.headers['content-type'], 'image/jpeg');
      t.ok(/xif\u0000\u0000/.test(res.payload), 'Should send payload as buffer');
      t.end();
    });
  });
  // Send Raw Image (not found)
  test('Send Back nothing if not found', (t) => {
    let options = {
      method: 'get',
      url: '/images/invalidimage.jpg'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should still respond with status code of 200');
      t.equal(res.payload, 'Image Not Found', 'Should reply with Image Not Found');
      t.end();
    });
  });
  // Get Raw Image Data
  test('Get raw image data(with credentials)', (t) => {
    let options = {
      method: 'get',
      url: '/images?imageurl=image1.jpg',
      credentials: {
        current_user: 'john'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should still respond with status code of 200');
      t.ok(JSON.parse(res.payload), 'Should reply with JSON formatted image data');
      let imageData = JSON.parse(res.payload);
      t.equal(imageData.imagetitle, 'Custom Upload', 'Should store default Custom Upload title');
      t.ok(imageData.uploaddate, 'Should store upload date');
      t.equal(imageData.imagebody, 'data:image/jpeg;base64,/9j/4Qj1RXhpZgAA', 'Should send back image body');
      t.end();
    });
  });
  // Get Raw Image Data (not authorized)
  test('Get raw image data(without credentials)', (t) => {
    let options = {
      method: 'get',
      url: '/images?imageurl=image1.jpg'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should still respond with status code of 200');
      t.equal(res.payload, 'Not Authorized', 'Should reply with Not Authorized');
      t.end();
    });
  });
  // Get All Image Urls
  test('Get all image urls', (t) => {
    let options = {
      method: 'get',
      url: '/images',
      credentials: {
        current_user: 'john'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should respond with status code of 200');
      t.ok(JSON.parse(res.payload), 'Should reply with JSON');
      let imageUrls = JSON.parse(res.payload).images;
      t.ok(imageUrls instanceof Array, 'JSON should contain array');
      t.ok(imageUrls.length > 0, 'Should contain at least one item in array');
      t.ok(imageUrls.indexOf('image1.jpg') > -1, 'Should contain the added image url');
      t.end();
    });
  });
  // Get Image Urls (not authorized)
  test('Get image urls (without credentials)', (t) => {
    let options = {
      method: 'get',
      url: '/images'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should still respond with status code of 200');
      t.equal(res.payload, 'Not Authorized', 'Should reply with Not Authorized');
      t.end();
    });
  });
  // Update Image Title
  test('Update image title', (t) => {
    let options = {
      method: 'post',
      url: '/images',
      headers: {
        'content-type': 'text/plain;charset=UTF-8'
      },
      credentials: {
        current_user: 'john'
      },
      payload: JSON.stringify({
        imageurl: 'image1.jpg',
        imagetitle: 'New Title'
      })
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should still respond with status code of 200');
      t.equal(res.payload, 'New Title', 'Should reply with New title');
      server.inject({
        method: 'get',
        url: '/images?imageurl=image1.jpg',
        credentials: {
          current_user: 'john'
        }}, (res) => {
        t.equal(JSON.parse(res.payload).imagetitle, 'New Title', 'new get request returns new title');
        t.end();
      });
    });
  });
  // Update Image Title (No credentials)
  test('Update image title (no credentials)', (t) => {
    let options = {
      method: 'post',
      url: '/images',
      payload: JSON.stringify({
        imageurl: 'image1.jpg',
        imagetitle: 'New Title'
      })
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should still respond with status code of 200');
      t.equal(res.payload, 'Not Authorized', 'Should reply with Not Authorized');
      t.end();
    });
  });
  /*************/
  /*************/
  /** Compose **/
  /*************/
  /*************/

  // Category Color Helpers
  test('Category Colors', (t) => {
    t.equal(categoryColor('css'), 'blue', 'CSS should be blue labelled');
    t.equal(categoryColor('design'), 'pink', 'Design should be pink labelled');
    t.equal(categoryColor('javascript'), 'red', 'JavaScript should be red labelled');
    t.equal(categoryColor('portfolio'), 'green', 'Portfolio should be green labelled');
    t.equal(categoryColor('databases'), 'grey', 'Databases should be grey labelled');
    t.equal(categoryColor('testing'), 'purple', 'Testing should be purple labelled');
    t.equal(categoryColor('html'), 'orange', 'HTML should be orange labelled');
    t.equal(categoryColor('personal'), 'light-blue', 'HTML should be light-blue labelled');
    t.end();
  });
  // Compose Post
  test('Compose Post (get)', (t) => {
    let options = {
      method: 'get',
      url: '/compose',
      credentials: {
        current_user: 'john'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should respond with status code of 200');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'View renders html/body tag');
      t.ok(/<form class="edit"/.test(res.payload), 'View displays edit form');
      t.ok(/design/i.test(res.payload), 'Should display a category name');
      t.ok(/css/i.test(res.payload), 'Should display a category name');
      t.end();
    });
  });
  // No credentials
  test('Compose Post (get with no credentials))', (t) => {
    let options = {
      method: 'get',
      url: '/compose'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 302, 'Should redirect without credentials');
      t.equal(res.headers['location'], '/', 'Should redirect to home');
      t.end();
    });
  });
  // Compose Post (post)
  test('Compose Post (post))', (t) => {
    let options = {
      method: 'post',
      url: '/compose',
      credentials: {
        current_user: 'john'
      },
      payload: {
        ownerusername: process.env.DB_USERNAME,
        imageurl: 'image1.jpg',
        posttitle: 'New Blog',
        categoryname: 'CSS',
        live: 'on',
        postbody: 'new blog post'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 302, 'Should redirect after compose');
      t.equal(res.headers['location'], '/blog', 'Should redirect to home');
      let newOptions = {
        method: 'get',
        url: '/blog/new-blog'
      };
      server.inject(newOptions, (res) => {
        t.equal(res.statusCode, 200, 'Should return 200 when getting new post');
        t.ok(/New Blog/i.test(res.payload), 'Should show new post title');
        t.ok(/CSS/i.test(res.payload), 'Should show category');
        t.ok(/image1\.jpg/.test(res.payload), 'Should show image');
        t.end();
      });
    });
  });
  // New post with serialised posturi
  test('Compose Post (duplicate title handled))', (t) => {
    let options = {
      method: 'post',
      url: '/compose',
      credentials: {
        current_user: 'john'
      },
      payload: {
        ownerusername: process.env.DB_USERNAME,
        imageurl: '',
        posttitle: 'New Blog',
        categoryname: 'CSS',
        live: 'on',
        postbody: 'newer blog post'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 302, 'Should redirect after compose');
      t.equal(res.headers['location'], '/blog', 'Should redirect to home');
      let newOptions = {
        method: 'get',
        url: '/blog/new-blog1'
      };
      server.inject(newOptions, (res) => {
        t.equal(res.statusCode, 200, 'Should return 200 when getting new-blog1 as new-blog already exists');
        t.ok(/New Blog/i.test(res.payload), 'Should show post title');
        t.ok(/CSS/i.test(res.payload), 'Should show category');
        t.notok(/image1\.jpg/.test(res.payload), 'No image shown');
        t.end();
      });
    });
  });
  // New post with no credentials
  test('Compose Post (post no credentials))', (t) => {
    let options = {
      method: 'post',
      url: '/compose',
      payload: {
        ownerusername: process.env.DB_USERNAME,
        imageurl: '',
        posttitle: 'Cannot post this',
        categoryname: 'CSS',
        live: 'on',
        postbody: 'newer blog post'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 302, 'Should redirect if no credentials');
      t.equal(res.headers['location'], '/', 'Should redirect to home');
      t.end();
    });
  });
  /**********/
  /**********/
  /** EDIT **/
  /**********/
  /**********/
  test('Edit Post (get)', (t) => {
    let options = {
      method: 'get',
      url: '/edit/new-blog',
      credentials: {
        current_user: 'john'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should respond with status code of 200');
      t.ok(/<html>/.test(res.payload) && /<body>/.test(res.payload), 'View renders html/body tag');
      t.ok(/<form class="edit" action="\/edit\/new-blog"/.test(res.payload), 'View displays edit form');
      t.ok(/design/i.test(res.payload), 'Should display a category name');
      t.ok(/css/i.test(res.payload), 'Should display a category name');
      t.end();
    });
  });
  // Edit post with no credentials
  test('Edit Post (post no credentials))', (t) => {
    let options = {
      method: 'post',
      url: '/edit/new-blog'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 302, 'Should redirect if no credentials');
      t.equal(res.headers['location'], '/', 'Should redirect to home');
      t.end();
    });
  });
  // Edit post (post, change title, postbody, categoryname, remove image)
  test('Edit Post (post))', (t) => {
    let options = {
      method: 'post',
      url: '/edit/new-blog',
      credentials: {
        current_user: 'john'
      },
      payload: {
        posturi: 'new-blog',
        imageurl: '',
        posttitle: 'Lovely New Blog',
        categoryname: 'Design',
        live: 'on',
        postbody: 'greater post body'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 302, 'Should redirect after edit');
      t.equal(res.headers['location'], '/blog/new-blog', 'Should redirect to blog');
      t.end();
    });
  });

  test('Review New Post from post snippets)', (t) => {
    let options = {
      method: 'get',
      url: '/blog/new-blog'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should return 200');
      t.ok(/Lovely New Blog/i.test(res.payload), 'Should show new post title');
      t.ok(/greater post body/i.test(res.payload), 'Should show new post body');
      t.notok(/image1\.jpg/.test(res.payload), 'Image not present anymore');
      t.end();
    });
  });
  // Edit post with no credentials
  test('Edit Post (post no credentials))', (t) => {
    let options = {
      method: 'post',
      url: '/edit/new-blog1',
      payload: {
        posturi: 'new-blog1',
        imageurl: '',
        posttitle: 'New Blog',
        categoryname: 'CSS',
        live: 'on',
        postbody: 'newer blog post'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 302, 'Should redirect if no credentials');
      t.equal(res.headers['location'], '/', 'Should redirect to home');
      t.end();
    });
  });
  /************/
  /************/
  /** DELETE **/
  /************/
  /************/

  // Delete Post
  test('Delete Post (post))', (t) => {
    let options = {
      method: 'get',
      url: '/delete/new-blog',
      credentials: {
        current_user: 'john'
      }
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 302, 'Should redirect after delete');
      t.equal(res.headers['location'], '/blog', 'Should redirect to blog');
      server.inject({method: 'get', url: 'blog'}, (res) => {
        t.notok(/Lovely New Blog/i.test(res.payload), 'Should not show deleted blog uri');
        t.notok(/newer blog post/i.test(res.payload), 'Should not show deleted blog postbody');
      });
      t.end();
    });
  });
  // Delete Post with no credentials
  test('Delete Post (no credentials)', (t) => {
    let options = {
      method: 'post',
      url: '/delete/new-blog-2'
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 302, 'Should redirect if no credentials');
      t.equal(res.headers['location'], '/', 'Should redirect to home');
      t.end();
    });
  });

  // Delete Image

  test('Delete Image (post))', (t) => {
    let options = {
      method: 'post',
      url: '/delete',
      headers: {
        'content-type': 'text/plain;charset=UTF-8'
      },
      credentials: {
        current_user: 'john'
      },
      payload: JSON.stringify({
        imageurl: 'image1.jpg'
      })
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 200, 'Should redirect after delete iamge');
      t.equal(res.payload, 'image1.jpg deleted', 'Should send delete message back containing image url');
      server.inject({method: 'get', url: '/images', credentials: options.credentials}, (res) => {
        let imageUrls = JSON.parse(res.payload).images;
        t.notok(imageUrls.indexOf('image1.jpg') > -1, 'Should not return deleted image');
        t.end();
      });
    });
  });
  // Delete Image with no credentials
  test('Delete Image (no credentials)', (t) => {
    let options = {
      method: 'get',
      url: '/delete',
      headers: {
        'content-type': 'text/plain;charset=UTF-8'
      },
      payload: JSON.stringify({
        imageurl: 'image1.jpg'
      })
    };
    server.inject(options, (res) => {
      t.equal(res.statusCode, 302, 'Should redirect if no credentials');
      t.equal(res.headers['location'], '/', 'Should redirect to home');
      t.end();
    });
  });
};

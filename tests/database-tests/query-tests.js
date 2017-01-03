// Tape //
const test = require('tape');
const buildDb = require('./build_test_database.js');
const dbConnTest = require('./dbconnection_test');

// Override production dbconnection to dbconnection_test
const proxyquire = require('proxyquire');
const dbConnReplace = {'../dbconnection.js': dbConnTest};

const posts = proxyquire('../../src/dbrequests/posts', dbConnReplace);
const createPost = proxyquire('../../src/dbrequests/createpost', dbConnReplace);
const del = proxyquire('../../src/dbrequests/delete', dbConnReplace);
const getCategories = proxyquire('../../src/dbrequests/getcategories', dbConnReplace);
const getUser = proxyquire('../../src/dbrequests/getuser', dbConnReplace);
const images = proxyquire('../../src/dbrequests/images', dbConnReplace);

// const updatePost = require('../../src/dbrequests/updatepost');

// Pre Build
buildDb((error) => {
  error ? console.log('Error Building Database: ', error) : queryTests();
});

// Query Tests
const queryTests = () => {
  // Home Page Query
  test('Query Build', (t) => {
    posts.getPost('welcome-to-my-site', (err, data) => {
      t.error(err, 'Should not throw an error when getting home post');
      t.equal(data.postid, 1, 'Should return post ID which should always be one');
      t.ok(typeof data.posturi === 'string', 'Should return post uri');
      t.ok(data.postbody.length > 0, 'Postbody should not be empty');
      t.notok(data.live, 'Home post should not be live blog post');
      t.equal(data.ownername, 'Nick Field', 'Site owner should be author of home page post');
      t.end();
    });
  });
  // Create Post
  test('Create Post', (t) => {
    let payload = {
      posttitle: 'New Post',
      posturi: 'new-post',
      imageurl: null,
      live: true,
      categoryname: 'CSS',
      postbody: 'hello world. This is a new post',
      ownerusername: 'njsfield'
    };
    createPost(payload, (err, data) => {
      t.error(err, 'Should not throw error when creating post');
      // Check if it with getPost
      posts.getPost('new-post', (err, data) => {
        t.error(err, 'Should not throw error when getting new post');
        t.notok(data.postid === 1, `New postID should not be home post id. New post id is ${data.postid}`);
        t.equal(data.posturi, 'new-post', 'Should return post uri');
        t.equal(data.postbody, 'hello world. This is a new post', 'Should return postbody');
        t.ok(data.live, 'New post should be live');
        t.equal(data.ownername, 'Nick Field', 'Author should be Nick Field');
        t.end();
      });
    });
  });
  // Retrieve array of posts
  test('Retrieve array of posts', (t) => {
    posts.getPosts((err, data) => {
      t.error(err, 'Should not throw an error when getting array of posts');
      t.ok(data instanceof Array, 'Data returned should be an array');
      t.ok(data.length > 1, 'Should return more than one post');
      t.equal(data[0].posturi, 'welcome-to-my-site', 'First array item should contain uri of home post');
      t.equal(data[data.length - 1].posturi, 'new-post', 'Last array item should contain information about latest post');
      t.end();
    });
  });
  // Create portfolio item post
  test('Create Post', (t) => {
    let payload = {
      posttitle: 'Portfolio Item',
      posturi: 'portfolio-item',
      imageurl: null,
      live: true,
      categoryname: 'Portfolio',
      postbody: 'This is a lovely portfolio piece',
      ownerusername: 'njsfield'
    };
    createPost(payload, (err, data) => {
      t.error(err, 'Should not throw error when creating portfolio post');
      // Check if it with getPost
      posts.getPost('portfolio-item', (err, data) => {
        t.error(err, 'Should not throw error when getting new portfolio post');
        t.notok(data.postid === 1, `New portfolio postID should not be home post id. New portfolio post id is ${data.postid}`);
        t.equal(data.posturi, 'portfolio-item', 'Should return post uri');
        // Portfolio piece should NOT be returned in getPost query
        posts.getPosts((err, data) => {
          let postUris = data.map(post => post.posturi);
          t.error(err, 'Should not throw an error when getting posts');
          t.ok(postUris.indexOf('portfolio-item' < 0), 'should not return new portfolio item post');
          // ... but should be returned with getPortfolioItems query
          posts.getPortfolioItems((err, data) => {
            let categoryNames = data.map(post => post.categoryname);
            let portfolioItemUris = data.map(post => post.posturi);
            t.error(err, 'Should not throw an error when getting posts');
            t.ok(categoryNames.every(name => name === 'Portfolio'), 'ALL portfolio posts should have category name of Portfolio');
            t.ok(portfolioItemUris.indexOf('portfolio-item' > -1), 'Should return new portfolio-item post data');
            t.end();
          });
        });
      });
    });
  });
  // Add/Get image(s)
  test('add/get image', (t) => {
    images.addImage('hello-world.jpg', 'CraZyBaSe64StRiNg', (err, data) => {
      t.error(err, 'Should not throw error when adding new image');
      images.getImage('hello-world.jpg', (err, data) => {
        t.error(err, 'Should not throw error when getting image');
        t.notok(data instanceof Array, 'data should not be array when querying one image');
        t.equal(data.imageurl, 'hello-world.jpg', 'should return correct image url');
        t.equal(data.imagetitle, 'Custom Upload', 'Custom Upload should be set as default title');
        t.equal(data.imagebody, 'CraZyBaSe64StRiNg', 'Should return base64 string');
        t.ok(data.uploaddate, `Should return additional information about upload date, date is: ${data.uploaddate}`);
        // Get images
        images.getImages((err, data) => {
          let imageUrls = data.map(image => image.imageurl);
          t.error(err, 'Should not throw error when adding images');
          t.ok(data instanceof Array, 'returned data should be in the form of array');
          t.ok(data.length > 0, 'Should return at least one image');
          t.ok(imageUrls.indexOf('hello-world.jpg') > -1, 'Should return the newly added image');
          t.end();
        });
      });
    });
  });
  // Delete Post
  test('Detete Post', (t) => {
    let targetPost = {};
    // Get latest post
    posts.getPost('new-post', (err, data) => {
      t.error(err, 'Should not throw error when retrieving latest post');
      targetPost.postid = data.postid;
      t.ok(targetPost.postid, 'Should retrieve postid from latest post');
      // Delete latest post
      del.deletePost(targetPost.postid, (err, data) => {
        t.error(err, 'Should not throw error when deleting post');
        // Attempt to get post
        posts.getPost('new-post', (err, data) => {
          t.error(err, 'Should not throw error when retrieving non-existent post');
          t.notok(data, 'Should NOT return any data');
          posts.getPosts((err, data) => {
            let postUris = data.map(post => post.posturi);
            t.error(err, 'Should not throw error when retrieving posts');
            t.ok(postUris.indexOf('new-post') < 0, 'Get posts should not return deleted post');
            t.end();
          });
        });
      });
    });
  });
  // Delete Image
  test('Detete Image', (t) => {
    del.deleteImage('hello-world.jpg', (err, data) => {
      t.error(err, 'Should not throw error when deleting image');
      // Attempt to get Image
      images.getImage('hello-world.jpg', (err, data) => {
        t.error(err, 'Should not throw error when retrieving non-existent post');
        t.notok(data, 'Should NOT return the deleted image');
        t.end();
      });
    });
  });
  // Get Categories
  test('Get Categories', (t) => {
    getCategories((err, data) => {
      t.error(err, 'should not throw error when retrieving categories');
      t.ok(data instanceof Array, 'returned data should be array');
      t.ok(data.indexOf('Portfolio') > -1, 'Should return Portfolio category');
      t.end();
    });
  });
  // Get User
  test('Get User', (t) => {
    getUser('njsfield', (err, data) => {
      t.error(err, 'Should not throw error when getting root user');
      t.ok(data.ownerusername, `Should return username: ${data.ownerusername}`);
      t.ok(data.ownername, `Should return name: ${data.ownername}`);
      t.ok(data.ownerpassword, `Should return password`);
      t.ok(data.owneremailaddress, `Should return emailaddress: ${data.owneremailaddress}`);
      t.ok(data.signupdate, `Should return signup date: ${data.signupdate}`);
      t.end();
    });
  });
};

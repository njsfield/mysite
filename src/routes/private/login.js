const sqlLogin = require('../../dbrequests/getuser.js');
const compare = require('bcrypt').compare;

// Check user, if none found callback none, otherwise reply user
const checkUser = (username, cb) => {
  sqlLogin(username, (err, data) => {
    err ? cb(err) : !data ? cb(null) : cb(null, data);
  });
};

// Check password, if no match callback null, otherwise reply true
const comparePasswords = (reqpass, dbpass, cb) => {
  compare(reqpass, dbpass, (err, isMatch) => {
    err ? cb(err) : !isMatch ? cb(null) : cb(null, true);
  });
};

// Template error message
const userNotFound = {
  message: 'Non existent user',
  errorclass: 'prompt--error'
};

// Template wrong password message
const wrongPassword = (username) => {
  return {
    message: 'Wrong password',
    errorclass: 'prompt--error',
    username: username
  };
};

const loginHandler = (req, reply) => {
  let { username, password } = req.payload;
  // Check user first
  checkUser(username, (err, data) => {
    // Get Username/pass. Reply error/User not found if needed. Otherwise...
    err ? reply(err) : !data ? reply.view('login', userNotFound) : (
      // Compare passwords
      comparePasswords(password, data.ownerpassword, (err, isMatch) => {
        // Reply error/wrongpassword message if needed. Otherwise...
        err ? reply(err) : !isMatch ? reply.view('login', wrongPassword(username)) : (
          // Set cookie & redirect to home
          req.cookieAuth.set({current_user: username}),
          reply.redirect('/')
        );
      }
      )
    );
  });
};

module.exports = {
  method: ['GET', 'POST'],
  path: '/login',
  config: {
    handler: (req, reply) => {
      if (req.method === 'get') {
        reply.view('login', { message: 'Please Kindly Log In' });
      } else {
        loginHandler(req, reply);
      }
    }
  }
};

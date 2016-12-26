const sqlLogin = require('../../dbrequests/getuser.js');
const compare = require('bcrypt').compare;

const checkUser = (username, cb) => {
  sqlLogin(username, (err, data) => {
    if (err) cb(err);
    else if (!data) cb(null);
    else cb(null, data);
  });
};

const comparePasswords = (reqpass, dbpass, cb) => {
  compare(reqpass, dbpass, (err, isMatch) => {
    if (err) cb(err);
    else if (!isMatch) cb(null);
    else cb(null, true);
  });
};

const userNotFound = {
  message: 'Non existent user',
  error: 'login-error'
};

const wrongPassword = (username) => {
  return {
    message: 'Wrong password',
    errorclass: 'prompt--error',
    username: username
  };
};

const loginHandler = (username, password, req, reply) => {
  checkUser(username, (err, data) => {
    if (err) {
      throw err;
    } else if (!data) {
      reply.view('login', userNotFound);
    } else {
      comparePasswords(password, data.ownerpassword, (err, isMatch) => {
        if (err) {
          throw err;
        } else if (!isMatch) {
          reply.view('login', wrongPassword(username));
        } else {
          req.cookieAuth.set({current_user: username});
          reply.redirect('/');
        }
      });
    }
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
        let username = req.payload.username;
        let password = req.payload.password;
        loginHandler(username, password, req, reply);
      }
    }
  }
};

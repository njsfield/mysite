const sqlLogin = require('../../dbrequests/getuser.js');
const env = require('env2');
// Install Environment Variables
env('./config.env');

const checkUser = (username, cb) => {
  sqlLogin(username, (err, data) => {
    if (err) cb(err);
    else if (!data) cb(null);
    else cb(null, data);
  });
};

const checkPassword = (reqpass, cb) => {
  reqpass === process.env.DB_PASSWORD ? cb(true) : cb(false);
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

const loginHandler = (req, reply) => {
  let username = req.payload.username;
  let password = req.payload.password;
  checkUser(username, (err, data) => {
    if (err) {
      throw err;
    } else if (!data) {
      reply.view('login', userNotFound);
    } else {
      checkPassword(password, (isMatch) => {
        if (!isMatch) {
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
        loginHandler(req, reply);
      }
    }
  }
};

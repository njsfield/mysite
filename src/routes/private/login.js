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

const loginHandler = function (request, reply) {
  if (request.method === 'get') {
    return reply.view('login', { message: 'Please Kindly Log In' });
  }
  if (request.method === 'post') {
    const username = request.payload.username;
    const password = request.payload.password;
    checkUser(username, (err, data) => {
      if (err) throw err;
      else if (!data) {
        reply.view('login', {
          message: 'User does not exist',
          error: 'login-error' });
      } else {
        comparePasswords(password, data.ownerpassword, (err, isMatch) => {
          if (err) { throw (err); }
          if (!isMatch) {
            reply.view('login', {
              message: 'Wrong password',
              errorclass: 'title--red',
              username: username
            });
          } else {
            request.cookieAuth.set({current_user: username});
            reply.redirect('/');
          }
        });
      }
    });
  }
};

module.exports = {
  method: ['GET', 'POST'],
  path: '/login',
  config: {
    handler: loginHandler
  }
};

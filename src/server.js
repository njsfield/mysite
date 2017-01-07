const Hapi = require('hapi');
const cookieAuth = require('hapi-auth-cookie');
const hapiContextCredentials = require('hapi-context-credentials');
const vision = require('vision');
const inert = require('inert');
const error = require('hapi-error');
const routes = require('./routes');
const server = new Hapi.Server();
const env = require('env2');

// status Code options
const config = {
  templateName: 'error',
  statusCodes: {
    401: { message: 'I could show you that buuuuuuuuuut I dont wanna' },
    404: { message: 'Sorry dear, that does not exist (yet may do one day)' },
    500: { message: 'This plane has no left phalange.' }
  }
};

// Install Environment Variables
env('./config.env');

// Set Cookie Options
const options = {
  password: process.env.COOKIE_PASSWORD,
  cookie: 'somecookie',
  ttl: 24 * 60 * 60 * 1000,
  isSecure: process.env.NODE_ENV === 'PRODUCTION',
  isHttpOnly: false,
  redirectTo: '/'
};  // make this :)

// For Dynos
// setInterval(() => {
//   let hourOfDay = new Date().getHours();
//   if (hourOfDay > 10 || hourOfDay < 5) {
//     require('http').get('http://in.nickfield.io/');
//   }
// }, 1800000); // every 30 minutes

// Set Connection
server.connection({
  port: process.env.PORT || 8080,
  routes: {
    files: {
      relativeTo: __dirname
    }
  }
});

// Register Plugins
server.register([vision, {register: error, options: config}, inert, cookieAuth, hapiContextCredentials], (err) => {
  if (err) { throw err; }

    // Register views
  server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path: '../views',
    layoutPath: '../views/layout/',
    helpersPath: '../views/helpers/',
    layout: 'default',
    partialsPath: '../views/partials/'
  });
  server.auth.strategy('session', 'cookie', options);

  const fileRoute = {
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: '../public'
      }
    }
  };
  const errorRoute = {
    method: 'GET',
    path: '/error',
    config: {
      handler: (req, reply) => {
        reply(new Error('500'));
      }
    }
  };
  server.route([fileRoute, errorRoute, ...routes]);
});

module.exports = server;

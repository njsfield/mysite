const Hapi = require('hapi');
const cookieAuth = require('hapi-auth-cookie');
const hapiContextCredentials = require('hapi-context-credentials');
const vision = require('vision');
const inert = require('inert');
const error = require('hapi-error');
const routes = require('./routes');
const server = new Hapi.Server();
const env = require('env2');

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

// Uncomment for production
// setInterval(() => {
//   require('http').get('http://the-badgerer.herokuapp.com');
// }, 300000); // every 5 minutes

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
server.register([vision, error, inert, cookieAuth, hapiContextCredentials], (err) => {
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

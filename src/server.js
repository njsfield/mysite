const Hapi = require('hapi');
const cookieAuth = require('hapi-auth-cookie');
const hapiContextCredentials = require('hapi-context-credentials');
const vision = require('vision');
const inert = require('inert');
const routes = require('./routes');
const server = new Hapi.Server();
const path = require('path');
const env = require('env2');

// Install environment variables
env('./config.env');

const options = {
  password: process.env.COOKIE_PASSWORD,
  cookie: 'somecookie',
  ttl: 24 * 60 * 60 * 1000,
  isSecure: process.env.NODE_ENV === 'PRODUCTION',
  isHttpOnly: false
};  // make this :)

// Uncomment for production
// setInterval(() => {
//   require('http').get('http://the-badgerer.herokuapp.com');
// }, 300000); // every 5 minutes

server.connection({
  port: process.env.PORT || 8080,
  routes: {
    files: {
      relativeTo: path.join(__dirname, '../public')
    }
  }
});

server.register([vision, inert, cookieAuth, hapiContextCredentials], (err) => {
  if (err) { throw err; }
  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: '../views',
    layoutPath: '../views/layout/',
    helpersPath: '../views/helpers/',
    layout: 'layout',
    partialsPath: '../views/partials/'
  });
  server.auth.strategy('session', 'cookie', options);
  server.route(routes);
});

module.exports = server;

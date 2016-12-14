// Public

const home = require('./routes/home');
const files = require('./routes/files');
const blog = require('./routes/blog');
const portfolio = require('./routes/portfolio');

// Private

const compose = require('./routes/compose');
const del = require('./routes/delete');
const edit = require('./routes/edit');
const hide = require('./routes/hide');
const images = require('./routes/images');
const login = require('./routes/login');
const logout = require('./routes/logout');
const show = require('./routes/show');

module.exports = [
  home,
  blog,
  portfolio,
  login,
  logout,
  compose,
  del,
  edit,
  hide,
  show,
  images,
  files
];

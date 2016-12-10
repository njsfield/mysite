// Public

const home = require('./public/home');
const files = require('./public/files');
const blog = require('./public/blog');
const portfolio = require('./public/portfolio');

// Private

const compose = require('./private/compose');
const del = require('./private/delete');
const edit = require('./private/edit');
const hide = require('./private/hide');
const images = require('./private/images');
const login = require('./private/login');
const logout = require('./private/logout');
const show = require('./private/show');

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

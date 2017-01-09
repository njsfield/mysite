// Public

const home = require('./public/home');
const blog = require('./public/blog');
const portfolio = require('./public/portfolio');

// Private

const compose = require('./private/compose');
const del = require('./private/delete');
const edit = require('./private/edit');
const image = require('./private/image');
const images = require('./private/images');
const addimage = require('./private/addimage');
const login = require('./private/login');
const logout = require('./private/logout');
const marked = require('./private/marked');

module.exports = [
  home,
  blog,
  portfolio,
  login,
  logout,
  compose,
  del,
  edit,
  addimage,
  image,
  images,
  marked
];

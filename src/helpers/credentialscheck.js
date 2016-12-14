module.exports = (req) => {
  return req.auth.isAuthenticated ? req.auth.credentials : '';
};

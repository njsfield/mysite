// Convert URIs. E.G 'Welcome To "My Site"' becomes 'welcome-to-%22my-site%22'
const sanitizeURI = (uri) => encodeURIComponent(uri.toLowerCase().replace(/\s/g, '-'));

// Takes uri, query function (e.g. getImages), a key to check, and calls back an incremented (if necessary) uri
const prepareURIForDb = (uri, queryFunc, key, cb) => {
  queryFunc((err, data) => {
    if (err) cb(err);
    data = data ? data.map(data => data[key]) : [];
    // Check URI function
    let existingURI = (currentUri) => data.indexOf(currentUri) > -1;
    // While found, increments URI. E.G 'Welcome To My Site1' becomes 'Welcome To My Site2'
    while (existingURI(uri)) {
      if (/\d(?=\.)/.test(uri)) {
        uri = uri.replace(/\d(?=\.)/, (match) => { return `${++match}`; });
      } else {
        uri = uri.replace(/\./, '1.');
      }
    }
    cb(null, uri);
  });
};

module.exports = {
  sanitizeURI,
  prepareURIForDb
};

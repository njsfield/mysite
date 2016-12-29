const dbConn = require('../dbconnection.js');

// Get Image
const getImage = (imageurl, cb) => {
  let query = `SELECT imageurl, imagetitle, uploaddate, imagebody
              FROM images
              INNER JOIN imagebodies
                ON imagebodies.imageid = images.imageid
              WHERE imageurl = $1`;
  dbConn.query(query, [imageurl], (err, data) => {
    (err ? cb(err) : cb(null, data.rows[0]));
  });
};

// Get Images
const getImages = (cb) => {
  dbConn.query(`SELECT * FROM images`, (err, data) => {
    (err ? cb(err) : cb(null, data.rows));
  });
};

// Update Image Title
const updateImageTitle = (imageurl, imagetitle, cb) => {
  let updateImageQuery = `Update images SET imagetitle = $1 WHERE imageurl = $2;`;
  dbConn.query(updateImageQuery, [imagetitle, imageurl], (err, data) => {
    (err) ? cb(err) : cb(null);
  });
};

// Add Image
const addImage = (imageurl, imagebody, cb) => {
  let firstQuery = `INSERT INTO images (imageurl, imagetitle, uploaddate) VALUES
  ($1, 'Custom Upload', CURRENT_DATE);`;

  let secondQuery = `INSERT INTO imagebodies (imageid, imagebody)
                  VALUES ((SELECT imageid FROM images WHERE imageurl = $1), $2 );`;

  dbConn.query(firstQuery, [imageurl], (err) => {
    if (err) throw err;
    else {
      dbConn.query(secondQuery, [imageurl, imagebody], (err, data) => {
        if (err) throw err;
        else {
          cb(data);
        }
      });
    }
  });
};

module.exports = {
  getImage,
  getImages,
  updateImageTitle,
  addImage
};

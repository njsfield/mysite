const dbConn = require('../dbconnection.js');

const firstQuery = `Update posts
    SET posttitle = $1,
        imageid = (SELECT imageid FROM images WHERE imageurl = $2),
        modifieddate = CURRENT_DATE,
        categoryid = (SELECT categoryid FROM categories WHERE categoryname = $3),
        live = $4
    WHERE postid = $5;`;

const secondQuery = `Update postbodies SET postbody = $1
    WHERE postid = $2;`;

const query = (payload, cb) => {
  let imageurl = payload.imageurl;
  let posttitle = payload.posttitle;
  let categoryname = payload.categoryname;
  let postbody = payload.postbody;
  let postid = payload.postid;
  let live = payload.live;

  dbConn.query('BEGIN TRANSACTION;', () => {
    dbConn.query(firstQuery, [posttitle, imageurl, categoryname, live, postid], (err, data) => {
      if (err) throw err;
      dbConn.query(secondQuery, [postbody, postid], (err, data) => {
        (err) ? cb(err) : cb(null);
        dbConn.query('COMMIT');
      });
    });
  });
};

module.exports = query;

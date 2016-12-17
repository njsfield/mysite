const dbConn = require('../dbconnection.js');

const firstQuery = `Update posts
    SET posttitle = $1,
        imageid = (SELECT imageid FROM images WHERE imageurl = $2),
        modifieddate = CURRENT_DATE,
        categoryid = (SELECT categoryid FROM categories WHERE categoryname = $3)
    WHERE postid = $4 AND ownerid IN
      (SELECT ownerid FROM owners
        WHERE owners.ownerusername = 'njsfield' AND
              owners.ownerpassword = '$2a$10$IJETvwsaxVYjxPDeRarqjOrYZQWFQCgQp6VohxK0N1JbBYxRpIz7e');`;

const secondQuery = `Update postbodies SET postbody = $1
    WHERE postid = $2;`;

const query = (payload, cb) => {
  let imageurl = payload.imageurl;
  let posttitle = payload.posttitle;
  let categoryname = payload.categoryname;
  let postbody = payload.postbody;
  let postid = payload.postid;

  dbConn.query('BEGIN TRANSACTION;', () => {
    dbConn.query(firstQuery, [posttitle, imageurl, categoryname, postid], (err, data) => {
      if (err) throw err;
      dbConn.query(secondQuery, [postbody, postid], (err, data) => {
        (err) ? cb(err) : cb(null);
        dbConn.query('COMMIT');
      });
    });
  });
};

module.exports = query;

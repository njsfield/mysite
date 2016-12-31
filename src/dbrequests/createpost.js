const dbConn = require('../dbconnection.js');

const firstQuery = `INSERT INTO posts (posttitle, posturi, imageid, creationdate, modifieddate, live, categoryid, ownerid)
                VALUES (
                $1,
                $2,
                (SELECT imageid FROM images WHERE imageurl = $3),
                CURRENT_DATE,
                CURRENT_DATE,
                $4,
                (SELECT categoryid FROM categories WHERE categoryname = $5),
                (SELECT ownerid FROM owners WHERE ownerusername = $6)) RETURNING postid;`;

const secondQuery = `INSERT INTO postbodies (postid, postbody)
                VALUES ($1, $2 );`;

const query = ({posttitle, posturi, imageurl, live, categoryname, postbody, ownerusername}, cb) => {
  dbConn.query(firstQuery, [posttitle, posturi, imageurl, live, categoryname, ownerusername], (err, data) => {
    (err) ? cb(err) : dbConn.query(secondQuery, [data.rows[0].postid, postbody], (err, data) => {
      (err) ? cb(err) : cb(null);
    });
  });
};

module.exports = query;

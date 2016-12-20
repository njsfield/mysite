const dbConn = require('../dbconnection.js');

const firstQuery = `INSERT INTO posts (posttitle, imageid, creationdate, modifieddate, live, categoryid, ownerid)
                VALUES (
                $1 ,
                (SELECT imageid FROM images WHERE imageurl = $2),
                CURRENT_DATE,
                CURRENT_DATE,
                $3,
                (SELECT categoryid FROM categories WHERE categoryname = $4),
                (SELECT ownerid FROM owners WHERE ownerusername = $5));`;

const secondQuery = `INSERT INTO postbodies (postid, postbody)
                VALUES ((SELECT MAX(postid) FROM posts), $1 );`;

const query = ({posttitle, imageurl, live, categoryname, postbody, ownerusername}, cb) => {
  dbConn.query('BEGIN TRANSACTION;', () => {
    dbConn.query(firstQuery, [posttitle, imageurl, live, categoryname, ownerusername], () => {
      dbConn.query(secondQuery, [postbody], (err, data) => {
        (err) ? cb(err) : cb(null);
        dbConn.query('COMMIT');
      });
    });
  });
};

// query('Welcome To My Site', 1, 1, 1, '## Hello, come on in\n My name is Nick', (err, data) => {
//   err ? console.log(err) : console.log(data);
// });

module.exports = query;

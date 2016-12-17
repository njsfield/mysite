const dbConn = require('../dbconnection.js');

const firstQuery = `INSERT INTO posts (posttitle, imageid, creationdate, modifieddate, live, categoryid, ownerid)
                VALUES ( $1 , $2 , CURRENT_DATE, CURRENT_DATE, TRUE, $3 , $4 );`;

const secondQuery = `INSERT INTO postbodies (postid, postbody)
                VALUES ((SELECT MAX(postid) FROM posts), $1 );`;

const query = (title, imageid, categoryid, ownderid, postbody, cb) => {
  dbConn.query('BEGIN TRANSACTION;', () => {
    dbConn.query(firstQuery, [title, imageid, categoryid, ownderid], () => {
      dbConn.query(secondQuery, [postbody], (err, data) => {
        (err) ? cb(err) : cb(null, data);
        dbConn.query('COMMIT');
      });
    });
  });
};

// query('Welcome To My Site', 1, 1, 1, '## Hello, come on in\n My name is Nick', (err, data) => {
//   err ? console.log(err) : console.log(data);
// });

module.exports = query;

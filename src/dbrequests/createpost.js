const dbConn = require('../dbconnection.js');

const firstQuery = `INSERT INTO posts (posttitle, imageid, creationdate, modifieddate, live, categoryid, ownerid)
                VALUES (
                $1 ,
                (SELECT imageid FROM images WHERE imageurl = $2),
                CURRENT_DATE,
                CURRENT_DATE,
                $3,
                (SELECT categoryid FROM categories WHERE categoryname = $4),
                (SELECT ownerid FROM owners WHERE ownerusername = $5)) RETURNING postid;`;

const secondQuery = `INSERT INTO postbodies (postid, postbody)
                VALUES ($1, $2 );`;

const query = ({posttitle, imageurl, live, categoryname, postbody, ownerusername}, cb) => {
  dbConn.query(firstQuery, [posttitle, imageurl, live, categoryname, ownerusername], (err, data) => {
    if (err) throw err;
    else {
      let postid = data.rows[0].postid;
      dbConn.query(secondQuery, [postid, postbody], (err, data) => {
        (err) ? cb(err) : cb(null);
      });
    }
  });
};

// query('Welcome To My Site', 1, 1, 1, '## Hello, come on in\n My name is Nick', (err, data) => {
//   err ? console.log(err) : console.log(data);
// });

module.exports = query;

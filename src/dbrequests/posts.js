const dbConn = require('../dbconnection.js');

const getPostQuery = `SELECT
      p.postid,
      pb.postbody,
      p.posttitle,
      i.imageurl,
      i.imagetitle,
      TO_CHAR(p.creationdate, 'DD - MM - YYYY') "creationdate",
      TO_CHAR(p.modifieddate, 'DD - MM - YYYY') "modifieddate",
      p.modifieddate,
      p.live,
      c.categoryname,
      o.ownername
      FROM posts AS p
INNER JOIN postbodies AS pb
      ON pb.postid = $1
LEFT JOIN images AS i
      ON i.imageid = p.imageid
INNER JOIN categories AS c
      on c.categoryid = p.categoryid
INNER JOIN owners as o
      on o.ownerid = p.ownerid
      WHERE p.postid = $1;`;

const getPostsQuery = getPostQuery.replace('$1', 'p.postid').replace('WHERE p.postid = $1;', ';');

const getPost = (postid, cb) => {
  dbConn.query(getPostQuery, [postid], (err, data) => {
    (err ? cb(err) : cb(null, data.rows[0]));
  });
};
const getPosts = (cb) => {
  dbConn.query(getPostsQuery, (err, data) => {
    (err ? cb(err) : cb(null, data.rows));
  });
};

module.exports = {
  getPost,
  getPosts
};

const dbConn = require('../dbconnection.js');

const getPostQuery = `SELECT
      p.postid,
      p.posturi,
      pb.postbody,
      p.posttitle,
      i.imageurl,
      i.imagetitle,
      TO_CHAR(p.creationdate, 'DD - MM - YYYY') "creationdate",
      TO_CHAR(p.modifieddate, 'DD - MM - YYYY') "modifieddate",
      p.live,
      c.categoryname,
      o.ownername
      FROM posts AS p
INNER JOIN postbodies AS pb
      ON pb.postid = (SELECT p.postid from posts as p WHERE posturi = $1)
LEFT JOIN images AS i
      ON i.imageid = p.imageid
INNER JOIN categories AS c
      on c.categoryid = p.categoryid
INNER JOIN owners as o
      on o.ownerid = p.ownerid
      WHERE p.posturi = $1;`;

const getPostsQuery = getPostQuery.replace('(SELECT p.postid from posts as p WHERE posturi = $1)', 'p.postid')
                                  .replace(`WHERE p.posturi = $1`, `WHERE c.categoryname <> 'Portfolio' ORDER BY p.creationdate DESC`);

const getPortfolioItemsQuery = getPostQuery.replace('(SELECT p.postid from posts as p WHERE posturi = $1)', 'p.postid')
                                          .replace(`WHERE p.posturi = $1`, `WHERE c.categoryname = 'Portfolio' ORDER BY p.creationdate DESC`);

const getPost = (posturi, cb) => {
  dbConn.query(getPostQuery, [posturi], (err, data) => {
    (err ? cb(err) : cb(null, data.rows[0]));
  });
};
const getPosts = (cb) => {
  dbConn.query(getPostsQuery, (err, data) => {
    (err ? cb(err) : cb(null, data.rows));
  });
};
const getPortfolioItems = (cb) => {
  dbConn.query(getPortfolioItemsQuery, (err, data) => {
    (err ? cb(err) : cb(null, data.rows));
  });
};

module.exports = {
  getPost,
  getPosts,
  getPortfolioItems
};

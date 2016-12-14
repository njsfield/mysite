const dbConn = require('../dbconnection.js');

const query = `SELECT p.postid,
      pb.postbody,
      p.posttitle,
      i.imageurl,
      TO_CHAR(p.creationdate, 'DD - MM - YYYY') "creationdate",
      TO_CHAR(p.modifieddate, 'DD - MM - YYYY') "modifieddate",
      p.modifieddate,
      p.live,
      c.categoryname,
      o.ownername
      FROM posts AS p
INNER JOIN postbodies AS pb
      ON pb.postid = $1
INNER JOIN images AS i
      ON i.imageid = p.imageid
INNER JOIN categories AS c
      on c.categoryid = p.categoryid
INNER JOIN owners as O
      on o.ownerid = p.ownerid;`;

module.exports = (postid, cb) => {
  dbConn.query(query, [postid], (err, data) => {
    (err ? cb(err) : cb(null, data.rows[0]));
  });
};

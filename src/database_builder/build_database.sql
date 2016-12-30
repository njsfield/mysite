BEGIN;

DROP  TABLE IF EXISTS posts cascade;
DROP  TABLE IF EXISTS postbodies cascade;
DROP  TABLE IF EXISTS owners cascade;
DROP  TABLE IF EXISTS categories cascade;
DROP  TABLE IF EXISTS images cascade;
DROP  TABLE IF EXISTS imagebodies cascade;

CREATE TABLE posts (
  postid SERIAL PRIMARY KEY NOT NULL,
  posttitle Text NOT NULL,
  posturi Text NOT NULL,
  imageid INTEGER,
  creationdate DATE NOT NULL,
  modifieddate DATE NOT NULL,
  live BOOLEAN,
  categoryid INTEGER,
  ownerid INTEGER NOT NULL
);

CREATE TABLE postbodies (
  postid INT REFERENCES posts ON DELETE CASCADE,
  postbody Text,
  PRIMARY KEY (postid)
);

CREATE TABLE owners (
  ownerid SERIAL PRIMARY KEY NOT NULL,
  ownername VARCHAR(100) NOT NULL,
  ownerusername VARCHAR(100) UNIQUE NOT NULL,
  ownerpassword VARCHAR(100) NOT NULL,
  owneremailaddress VARCHAR(100) NOT NULL,
  signupdate DATE NOT NULL,
  postssubmitted INTEGER
);

CREATE TABLE categories (
  categoryid SERIAL PRIMARY KEY NOT NULL,
  categoryname VARCHAR(100) NOT NULL
);

CREATE TABLE images (
  imageid SERIAL PRIMARY KEY NOT NULL,
  imageurl VARCHAR(500) NOT NULL,
  imagetitle VARCHAR(500),
  uploaddate DATE NOT NULL
);

CREATE TABLE imagebodies (
  imageid INT REFERENCES images ON DELETE CASCADE,
  imagebody TEXT,
  PRIMARY KEY (imageid)
);

INSERT INTO owners (ownername, ownerusername, ownerpassword, owneremailaddress, signupdate, postssubmitted) VALUES
('Nick Field', 'njsfield', '$2a$10$IJETvwsaxVYjxPDeRarqjOrYZQWFQCgQp6VohxK0N1JbBYxRpIz7e', 'heyimnick@live.com', CURRENT_DATE, 0);

INSERT INTO categories (categoryname) VALUES
('CSS'),
('JavaScript'),
('Design'),
('Portfolio'),
('Databases'),
('Testing'),
('HTML'),
('Personal');

INSERT INTO posts (posttitle, posturi, imageid, creationdate, modifieddate, live, categoryid, ownerid) VALUES
('Welcome To My Site', 'welcome-to-my-site', null, CURRENT_DATE, CURRENT_DATE, TRUE, 1, 1);

INSERT INTO postbodies (postid, postbody) VALUES
((SELECT MAX(postid) FROM posts),
  'I am **freelance** Web Developer based in London. Things I love:
- JavaScript
- CSS
- HTML
- Design
- Food

Want to work together? Email me at [heyimnick@live.com](mailto://heyimnick@live.com).

#### Thank you :)');

COMMIT;

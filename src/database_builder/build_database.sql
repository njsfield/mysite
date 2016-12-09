BEGIN;

DROP  TABLE IF EXISTS posts cascade;
DROP  TABLE IF EXISTS postbodies cascade;
DROP  TABLE IF EXISTS owners cascade;
DROP  TABLE IF EXISTS categories cascade;
DROP  TABLE IF EXISTS images cascade;

CREATE TABLE posts (
  postid SERIAL PRIMARY KEY NOT NULL,
  posttitle VARCHAR(1000) NOT NULL,
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

CREATE TABLE Owners (
  ownerid SERIAL PRIMARY KEY NOT NULL,
  ownername VARCHAR(100) NOT NULL,
  ownerusername VARCHAR(100) UNIQUE NOT NULL,
  ownerpassword VARCHAR(100) NOT NULL,
  owneremailaddress VARCHAR(100) NOT NULL,
  signupdate DATE NOT NULL,
  postssubmitted INTEGER
);

CREATE TABLE Categories (
  categoryid SERIAL PRIMARY KEY NOT NULL,
  categoryname VARCHAR(100) NOT NULL
);

CREATE TABLE Images (
  imageid SERIAL PRIMARY KEY NOT NULL,
  imageurl VARCHAR(500) NOT NULL,
  imagetitle VARCHAR(500),
  uploaddate DATE NOT NULL
);

INSERT INTO owners (ownername, ownerusername, ownerpassword, owneremailaddress, signupdate, postssubmitted) VALUES
('Nick Field', 'njsfield', '$2a$10$IJETvwsaxVYjxPDeRarqjOrYZQWFQCgQp6VohxK0N1JbBYxRpIz7e', 'heyimnick@live.com', CURRENT_DATE, 0);

INSERT INTO categories (categoryname) VALUES
('CSS'),
('JavaScript'),
('Design'),
('Portfolio');

INSERT INTO images (imageurl, imagetitle, uploaddate) VALUES
('https://github.com/FAC9/the-badgerer/blob/master/public/images/badger1.jpg', 'A Badger', CURRENT_DATE),
('https://github.com/FAC9/the-badgerer/blob/master/public/images/badger2.jpg', 'Another Badger', CURRENT_DATE),
('https://github.com/FAC9/the-badgerer/blob/master/public/images/badger3.jpg', 'A third Badger', CURRENT_DATE);

COMMIT;

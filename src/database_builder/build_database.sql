BEGIN;

DROP  TABLE IF EXISTS Posts cascade;
DROP  TABLE IF EXISTS PostBodies cascade;
DROP  TABLE IF EXISTS Owners cascade;
DROP  TABLE IF EXISTS Categories cascade;
DROP  TABLE IF EXISTS Images cascade;

CREATE TABLE Posts (
  PostID SERIAL PRIMARY KEY NOT NULL,
  PostTitle VARCHAR(1000) NOT NULL,
  ImageID INTEGER,
  CreationDate DATE NOT NULL,
  ModifiedDate DATE NOT NULL,
  Live BOOLEAN,
  CategoryID INTEGER,
  OwnerID INTEGER NOT NULL
);

CREATE TABLE PostBodies (
  PostID INT REFERENCES Posts ON DELETE CASCADE,
  PostBody Text,
  PRIMARY KEY (PostID)
);

CREATE TABLE Owners (
  OwnerID SERIAL PRIMARY KEY NOT NULL,
  OwnerName VARCHAR(100) NOT NULL,
  OwnerUsername VARCHAR(100) UNIQUE NOT NULL,
  OwnerPassword VARCHAR(100) NOT NULL,
  OwnerEmailAddress VARCHAR(100) NOT NULL,
  SignupDate DATE NOT NULL,
  PostsSubmitted INTEGER
);

CREATE TABLE Categories (
  CategoryID SERIAL PRIMARY KEY NOT NULL,
  CategoryName VARCHAR(100) NOT NULL
);

CREATE TABLE Images (
  ImageID SERIAL PRIMARY KEY NOT NULL,
  ImageURL VARCHAR(500) NOT NULL,
  ImageTitle VARCHAR(500),
  UploadDate DATE NOT NULL
);

INSERT INTO Owners (OwnerName, OwnerUsername, OwnerPassword, OwnerEmailAddress, SignupDate, PostsSubmitted) VALUES
('Nick Field', 'njsfield', '$2a$10$IJETvwsaxVYjxPDeRarqjOrYZQWFQCgQp6VohxK0N1JbBYxRpIz7e', 'heyimnick@live.com', CURRENT_DATE, 0);

INSERT INTO Categories (CategoryName) VALUES
('CSS'),
('JavaScript'),
('Design'),
('Portfolio');

INSERT INTO Images (ImageURL, ImageTitle, UploadDate) VALUES
('https://github.com/FAC9/the-badgerer/blob/master/public/images/badger1.jpg', 'A Badger', CURRENT_DATE),
('https://github.com/FAC9/the-badgerer/blob/master/public/images/badger2.jpg', 'Another Badger', CURRENT_DATE),
('https://github.com/FAC9/the-badgerer/blob/master/public/images/badger3.jpg', 'A third Badger', CURRENT_DATE);

COMMIT;

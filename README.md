# Description
A personal website to host a blog, biography, and personal/professional projects

# Mockups

### Home/Nav
![Nav/home](./mockups/nav-home.png)
### Blog
![Blog](./mockups/blog.png)
### Portfolio
![Portfolio](./mockups/portfolio.png)

# Schema
![Schema](./mockups/schema.png)

### Initialise DB
```sql
CREATE TABLE Posts (
  PostID SERIAL PRIMARY KEY NOT NULL,
  PostBodyID INTEGER NOT NULL,
  PostTitle VARCHAR(1000) NOT NULL,
  ImageID INTEGER NOT NULL,
  PostDate DATE        NOT NULL,
  CategoryID INTEGER NOT NULL,
  OwnerID INTEGER NOT NULL
);

CREATE TABLE PostBodies (
  PostBodyID SERIAL PRIMARY KEY NOT NULL,
  PostBody JSONB
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

INSERT INTO Owners (OwnerName, OwnerUsername, OwnerPassword, OwnerEmailAddress, SignupDate, PostsSubmitted) VALUES
('Nick Field', 'njsfield', '$2a$10$IJETvwsaxVYjxPDeRarqjOrYZQWFQCgQp6VohxK0N1JbBYxRpIz7e', 'heyimnick@live.com', CURRENT_DATE, 0);

CREATE TABLE Categories (
  CategoryID SERIAL PRIMARY KEY NOT NULL,
  CategoryName VARCHAR(100) NOT NULL
);

INSERT INTO Categories (CategoryName) VALUES
('CSS'),
('JavaScript'),
('Design');

CREATE TABLE Images (
  ImageID SERIAL PRIMARY KEY NOT NULL,
  ImageURL VARCHAR(500) NOT NULL,
  UploadDate DATE NOT NULL
);

INSERT INTO Images (ImageURL, UploadDate) VALUES
('https://github.com/FAC9/the-badgerer/blob/master/public/images/badger1.jpg', CURRENT_DATE),
('https://github.com/FAC9/the-badgerer/blob/master/public/images/badger2.jpg', CURRENT_DATE),
('https://github.com/FAC9/the-badgerer/blob/master/public/images/badger3.jpg', CURRENT_DATE);

```
### Insert Post

```sql
BEGIN TRANSACTION;
   INSERT INTO PostDetails (PostData) VALUES ('{
  	"PostTitle": "A Guide to Flexbox",
  	"ImageID": 1,
  	"PostContent": "This is a blog post",
  	"CategoryID": 1,
  	"OwnerID": 1
  }');
  INSERT INTO Posts (PostDetailID, PostTitle, ImageID, PostDate, CategoryID, OwnerID)
  SELECT PostDetailID,
    PostData->>'PostTitle' AS PostTitle,
    CAST(PostData->>'ImageID' AS INT) AS ImageID,
    CURRENT_DATE,
    CAST(PostData->>'CategoryID' AS INT) AS CategoryID,
    CAST(PostData->>'OwnerID' AS INT) AS OwnerID
  FROM PostDetails
  WHERE PostDetailID IN (SELECT MAX(PostDetailID) FROM PostDetails);
COMMIT;
```

### Update Post

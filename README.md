# Description
A personal website to host a biography, a blog, and personal/professional projects.
Users can view blog posts and filter them by category.
The owner can log in, edit/create/delete/hide blog and portfolio posts.

# Technologies
Node.js  
Hapi.js
Bcrypt
Handlebars
Postgres

# Mockups

### Home/Nav
![Nav/home](./mockups/nav-home.png)
### Blog
![Blog](./mockups/blog.png)
### Portfolio
![Portfolio](./mockups/portfolio.png)
### Create Post Flow
![Createpostflow](./mockups/createpostflow.png)

# Schema
![Schema](./mockups/schema.png)

### Insert Post Query
```sql
BEGIN TRANSACTION;
  INSERT INTO Posts (PostTitle, ImageID, CreationDate, ModifiedDate, Live, CategoryID, OwnerID)
    VALUES ('A Guide To Flexbox' , 1 , CURRENT_DATE, CURRENT_DATE, TRUE, 1, 1);
  INSERT INTO PostBodies (PostId, PostBody)
    VALUES ((SELECT MAX(PostID) FROM Posts), 'Flexbox is simply incredible');
COMMIT;
```

### Return Whole Post Query
```sql
SELECT * FROM Posts INNER JOIN PostBodies ON PostBodies.PostID = 1;
```
### Update Post
```sql
BEGIN TRANSACTION;
  Update Posts
    SET PostTitle = 'CSS is super', ImageID = 2, ModifiedDate = CURRENT_DATE, CategoryID = 1
    WHERE PostID = 1 AND OwnerID IN
      (SELECT OwnerID FROM Owners
        WHERE Owners.OwnerUsername = 'njsfield' AND
              Owners.OwnerPassword = 'badger');
  Update PostBodies SET PostBody = 'I just love it so much'
    WHERE PostID = 1;
COMMIT;
```
### Delete Post
```sql
DELETE FROM Posts WHERE PostId = 1 AND OwnerID IN
  (SELECT OwnerID FROM Owners
    WHERE Owners.OwnerUsername = 'njsfield' AND
          Owners.OwnerPassword = 'Badger');
```
### Hide Post
```sql
Update Posts SET Live = FALSE WHERE PostID = 1;
```
### Show Post
```sql
Update Posts SET Live = TRUE WHERE PostID = 1;
```
### Return Posts By Category
```sql
SELECT * FROM Posts WHERE Posts.CategoryID IN
(SELECT CategoryId FROM Categories WHERE Categories.CategoryName = 'CSS');
```

# Routes
### Public
/home [GET]  
/blog (queries: filterby='CSS/JavaScript/Design' ) [GET]  
/blog/id [GET]  
/portfolio [GET]   
/portfolio/id [GET]  

### Owner
/login [GET, POST]    
/logout [GET]  
/compose [GET, POST]  
/edit/id [GET,PUT]  
/delete/id [DELETE]   
/hide/id [PUT]  
/show/id [PUT]  
/images [GET, POST]


# HBS

## Views

home.hbs  
blog.hbs  
post.hbs  
portfolio.hbs  
edit.hbs  
compose.hbs  
login.hbs  

## Partials

posts.hbs  
header.hbs
portfolioitems.hbs  

## Layout

default.hbs  

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

INSERT INTO owners (ownername, ownerusername, owneremailaddress, signupdate, postssubmitted) VALUES
('Nick Field', 'njsfield', 'heyimnick@live.com', CURRENT_DATE, 0);

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
('Welcome To My Site', 'welcome-to-my-site', null, CURRENT_DATE, CURRENT_DATE, FALSE, 1, 1);

INSERT INTO postbodies (postid, postbody) VALUES
((SELECT MAX(postid) FROM posts),
  'I’m a problem solver and a builder. -center-

I enjoy working toward milestones and collecting new ones.
Graphing the connection between keyboard typing and the beating heart of an online system is highly motivating. -center-

In that context, I’m disciplined in **JavaScript**, **HTML** and **CSS**, I work in **NodeJS** on the server side, and dabble in many a **SQL** query. I test a lot with libraries like [Tape](https://www.npmjs.com/package/tape
)/[Jasmine](https://jasmine.github.io/
), I use [GitHub](https://jasmine.github.io/
) for version control, using [Atom](https://atom.io/) to write code with (and [Brackets](http://brackets.io/) for design), as well as other technologies to help me do what I do. -center-

I’m a digital design hobbyist, I use Illustrator CC a lot when not writing code, and have a musical background which remains a strong interest- I have ventured heavily into music production, sound design and audio recording before being ~~kidnapped~~ lovestruck by the web. -center-

You’ll often find me at [Founders and Coders](http://www.foundersandcoders.com/), as well of many [meetups](https://www.meetup.com/cities/gb/17/london/
) in London. -center-

Contact me at [heyimnick@live.com](mailto://heyimnick@live.com) -center-');

INSERT INTO posts (posttitle, posturi, imageid, creationdate, modifieddate, live, categoryid, ownerid) VALUES
('Markdown Style Guide', 'markdown-style-guide', null, CURRENT_DATE, CURRENT_DATE, TRUE, 3, 1);

INSERT INTO postbodies (postid, postbody) VALUES
((SELECT MAX(postid) FROM posts),
'# This heading is big
## This is smaller
### This is smaller than before
#### This is smaller but centered -center-
##### etc -center-
###### etc -center-
*italic*
**bold**
~~line-through~~
1. Ordered-1
2. Ordered-2
3. Ordered-3
- Unordered-1
- Unordered-2
- Unordered-3
1. Ordered-1 (centered) -center-
2. Ordered-2
3. Ordered-3
- Unordered-1 (centered) -center-
- Unordered-2
- Unordered-3
Icons are cool, for example, to restart your computer hit <i class="i i--key">ctrl</i>+<i class="i i--key">alt</i>+<i class="i i--key">delete</i>
Heres a useful function to help-
```javascript
function javascript(syntax) {
 var marked;
 var string = "hello";
 let string = false;
 if (!marked) {
  string = "cant see colours";
}
return string;
}
```
```javascript
const isCentered = (this) => this.centered ? true : false;
-center-
```
It would not be sensible to use the command `sudo rm -rf /
`

| Tables        | Are           | Cool           |
| ------------- |:-------------:| --------------:|
| col 3 is      | right-aligned | I *love* that  |
| col 2 is      | **centered**  |    which is fine|
| zebra stripes | are ~~neat~~  |        ...maybe|


To demonstrate paragraph styling, this is a block of (you guessed it!) lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Lets take a break from that left aligned nonsense and go right back in with duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. -center-
> This is a blockquote, which uses **:before** and **:after** pseudo elements of course. Me- 2016');


COMMIT;

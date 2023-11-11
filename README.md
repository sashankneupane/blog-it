# Simple Blog Site

[ait-project.sashankneupane.com](http://ait-project.sashankneupane.com)

## Overview

The blogsite will be a platform for people to write and share blogs to the world. The site will support all creation, update, and deletion of existing/new blogs from the site itself. The site will also support user authentication.

Only authenticated users can write blogs and blogs written by a user can be seen in their profile page. Authenticated users can also view all blogs written by other users in the home page.

## Data Model

The application will store Users and Blogs.

- users can have multiple blogs (via references)

An Example User:

```javascript
{
  username: "shannonshopper",
  email: // a valid email address,
  hash: // a password hash,
  name: "Shannon Shopper",
  blogs: // an array of references to Blog documents
}
```

An Example Blogpost with Embedded Items:

```javascript
{
  author: // a reference to a User object
  title: "Why is Javascript so hard?",
  content: "I've been trying to learn Javascript for the past 2 years and I still don't understand it."
  timestamp: // timestamp
}
```

## [Link to Commented First Draft Schema](db.mjs)

## Wireframes

/ - home page
![home page](public/documentation/home.png)

/register - registration page
![registration page](public/documentation/register.png)

/login - login page
![login page](public/documentation/login.png)

/dashboard - user dashboard page
![user dashboard page](public/documentation/dashboard.png)

/blog-create - blog create page
![blog create page](public/documentation/blog-create.png)

/blog/:blogId - blog post page
![blog post page](public/documentation/blog-post.png)

/blog/:blogId/edit - blog edit page
![blog edit page](public/documentation/blog-edit.png)

/u/:username - user's public blog page
![user profile page](public/documentation/username.png)

## Site map

![site map](public/documentation/site-map.jpeg)

## User Stories or Use Cases

| #   | User Story                | Description                                                                                                                              |
| --- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | User Registration         | New users can register with a unique username and email to create an account and access the blog site.                                   |
| 2   | User Login                | Registered users can log in using their username and password to access their accounts and personalized features.                        |
| 3   | Password Recovery         | Users can recover their password in case they forget it, ensuring access to their accounts.                                              |
| 4   | User Profile              | Users have a profile page displaying their username, name, email, and a list of authored blog posts for personal information management. |
| 5   | User Dashboard            | Logged-in users can access a dashboard to create new blog posts and manage existing content easily.                                      |
| 6   | Blog Creation             | Users can create new blog posts by providing a title and content, sharing their thoughts and stories.                                    |
| 7   | Blog Listing              | Users can view a list of all blog posts, discovering and reading content authored by others.                                             |
| 8   | Individual Blog Post View | Users can read the full title and content of individual blog posts when they click on them.                                              |
| 9   | Blog Editing              | Authors of blog posts can edit the content of their existing posts, making updates or corrections.                                       |
| 10  | Blog Deletion             | Authors of blog posts can delete their own posts, removing content as needed.                                                            |
| 11  | User Logout               | Logged-in users can log out to secure their accounts and data when they're done using the site.                                          |

## Research Topics

| Checkbox | Points | Description                                                                |
| :------: | :----: | -------------------------------------------------------------------------- |
|   [x]    |   5    | Integrate user authentication with Passportjs                              |
|   [ ]    |   4    | Implement client-side form validation using a JavaScript library.          |
|   [x]    |   3    | Manage configuration variables using dotenv.                               |
|   [x]    |   3    | Deploy the application on a Digital Ocean Droplet with a Namecheap domain. |
|   [ ]    |   2    | Style the site using Tailwind CSS.                                         |

## [Link to Initial Main Project File](app.mjs)

## Annotations / References Used

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. [nodemailer docs](https://nodemailer.com/about/) - (add link to source code that was based on this)

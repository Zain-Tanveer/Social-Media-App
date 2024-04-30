# SociableSpace

SociableSpace is a social media app created using [HTML][html], [CSS][css], and [JavaScript][js]. It uses [dummyjson][dummyjson] apis to handle functionalities such as login, user authentication, showing posts, comments, and users.

The website is mobile responsive.

## Technologies Used

- [HTML][html]
- [CSS][css]
- [Bootstrap][bootstrap]
- [JavaScript][js]

## Functionalites

- Login

  - The system allows the user to login.
  - Since [dummyjson][dummyjson] apis are used, the user can only login using the credentials provided by [dummyjson][dummyjson].
  - Use **"kminchelle"** for **"username"** and **"0lelplR"** for **"password"**.

- Authentication

  - The system authenticates the user via token.
  - Upon login a token is generated and stored in localstorage.
  - When the user accesses any other page i.e., newsfeed, search, or profile page then an authenticated function is run.
  - If the token is valid then the user can access features of that page. Otherwise the user is redirected back to login page.

- Display posts

  - The system displays a list of 10 posts on the newsfeed page fetched using [dummyjson][dummyjson] posts api.
  - When the last post is in view, the system again fetches the next 10 posts and displays them to the user.

- Display comments

  - On each post the system displays all comments related to that post.
  - The comments are fetched using [dummyjson][dummyjson] comments api.

- Add comments

  - The system allows the current logged in user to add a comment under any post.
  - **NOTE:** Since the add comment api provided by [dummyjson][dummyjson] does not actually add the comment in database, the comment is only displayed on the frontend side. The comment will disappear once the page is reloaded or closed.

- Edit comment

  - The system allows the user to edit a comment.
  - Only the comments of the current logged in user can be edited.
  - **NOTE:** Since the edit comment api provided by [dummyjson][dummyjson] does not actually edit the comment in database, the edited comment is only displayed on the frontend side. The edited comment will disappear once the page is reloaded or closed.

- Delete comment

  - The system allows the user to delete a comment.
  - Only the comments of the current logged in user can be deleted.
  - **NOTE:** Since the delete comment api provided by [dummyjson][dummyjson] does not actually delete the comment in database, if an already existing comment of the current logged in user is deleted, the result will only be reflected on the frontend. On page refresh the comment will come back.

- Search posts

  - The system allows the user to search for a post using the search input field in the header section of newsfeed, profile, and search pages.
  - When the user enters some text in the search input field, a list of posts is displayed.
  - When the user clicks on the post, the system redirects the user to search page where a list of posts related to the entered text are displayed.
  - The posts are fetched using the search posts api provided by [dummyjson][dummyjson].

- Display user specific posts

  - The system allows the user to search for any users using the search input field in the header section of newsfeed, profile, and search pages.
  - When the user enters some text in the search input field, a list of users is displayed.
  - When the user clicks on a specific user, the system redirects the user to their user profile page.
  - On the user profile page, the system displays a list of posts related said user.

- Display user information

  - The system displays user related information in the side profile section on newsfeed.
  - On click of the profile picture, the system redirects user the their profile page.

- Display users

  - The system displays a list of users fetched using [dummyjson][dummyjson] users api in the people you may know section on the newsfeed page.
  - When a user is clicked, the system redirects the user to that user's profile page.

- Logout
  - The system allows the user to logout.
  - In the header section, when the user clicks the user-gear icon, the system displays a dropdown with a logout button.
  - When the logout button is clicked, the system logs out the user.

## Clone the repository

```bash
git clone https://github.com/Zain-Tanveer/Social-Media-App.git
```

Navigate to the project directory:

```bash
cd Social-Media-App
```

## UI Design

### Login Page

![Login Page Screenshot][login]

### Newsfeed page

![Newsfeed Page Screenshot][newsfeed]

### Edit comment

![Edit Comment Screenshot][editComment]

### Delete comment

![Delete Comment Screenshot][deleteComment]

### Search posts and users

![Search Screenshot][search]

### Search page

![Search Page Screenshot][searchPage]

### Profile page

![Profile Page Screenshot][profile]

### Logout

![Logout Screenshot][logout]

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job."
[html]: https://en.wikipedia.org/wiki/HTML
[css]: https://en.wikipedia.org/wiki/CSS
[bootstrap]: https://getbootstrap.com/docs/5.3/getting-started/introduction/
[js]: https://en.wikipedia.org/wiki/JavaScript
[dummyjson]: https://dummyjson.com/
[login]: assets/screenshots/login.png
[newsfeed]: assets/screenshots/newsfeed.png
[editComment]: assets/screenshots/edit-comment.png
[deleteComment]: assets/screenshots/delete-comment.png
[search]: assets/screenshots/search.png
[searchPage]: assets/screenshots/search-page.png
[profile]: assets/screenshots/profile.png
[logout]: assets/screenshots/logout.png

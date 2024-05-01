import authenticate from "./classes/Authenticate.class.js";
import newsfeedClass from "./classes/Newsfeed.class.js";
import Post from "./classes/Post.class.js";
import Modal from "./classes/Modal.class.js";
import Header from "./classes/Header.class.js";

// this will remove the hardcoded html in posts.
document.getElementById("posts").innerHTML = "";

// authenticates user. if failed will redirect
await authenticate.isAuthenticated();

(async () => {
  Header.setProfileSettingsUser(); // setting the html of user in profile settings dropdown
  Header.enableUserSettings(); // enabling the profile settings dropdown button.
  Header.addLogoutEventListener(); // adding logout event listener on logout click

  // this checks if the screen width is less than 960px.
  // this is for the search dropdown on mobile screens
  if (document.body.clientWidth <= 960) {
    const containerEl = document.querySelector(".search-dropdown");
    Header.setContainerElement(containerEl);
  }

  Header.addSearchEventListener(); // adding focus event listener on search input field to display the dropdown
  Header.addSearchKeyUpEventListener(); // adding keyup event listener on search input field
  Header.addSearchPostEventListener(); // adding click event listener on the first item displayed in search dropdown

  newsfeedClass.setUser(); // setting logged in user info for class usage
  newsfeedClass.setUserData(); // setting user data in side profile
  newsfeedClass.addSidePostProfileEventListener(); // adding click event listener on side profile user image

  newsfeedClass.hideSaySomethingLoader(); // hiding say something loader
  newsfeedClass.showSaySomethingElement(); // showing say something element
  newsfeedClass.hideUserSideProfileLoader(); // hiding user side profile loader
  newsfeedClass.showUserSideProfile(); // showing side profile

  newsfeedClass.setPeopleMayKnowUsers(); // setting people you may know users

  // setting all posts on newsfeed page.
  // all of the code after this is dependent on posts being set.
  // if some error occurs while fetching posts data then the
  // code after this will not run.
  const response = await newsfeedClass.setAllPosts();
  if (response.error) {
    return;
  }

  newsfeedClass.setNotifications(); // this will set the notifications in recent notifications

  newsfeedClass.addScrollEventListener(); // setting scroll event listener for getting more posts

  Modal.addDeleteModalEventListener(); // adding click event listener on delete comment

  // this is a custom event. it is triggered every time when the last
  // post is on screen. see 'addScrollEventListener()' in newsfeed class.
  document.addEventListener("handleNewPosts", async () => {
    Post.setSkip(Post.getSkip() + Post.getLimit()); // updating the skip value to get next 10 posts
    await newsfeedClass.setAllPosts(); // getting the next 10 posts
    newsfeedClass.addScrollEventListener(); // setting scroll event listener for getting more posts
  });
})();

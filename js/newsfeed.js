import authenticate from "./classes/Authenticate.class.js";
import newsfeedClass from "./classes/Newsfeed.class.js";
import Post from "./classes/Post.class.js";
import Modal from "./classes/Modal.class.js";
import Header from "./classes/Header.class.js";

// this will remove that hardcoded post in html.
document.getElementById("posts").innerHTML = "";

// authenticates user. if failed will redirect
await authenticate.isAuthenticated();

(async () => {
  Header.setProfileSettingsUser();
  Header.enableUserSettings();
  Header.addLogoutEventListener();

  if (document.body.clientWidth <= 960) {
    const containerEl = document.querySelector(".search-dropdown");
    Header.setContainerElement(containerEl);
  }

  Header.addSearchEventListener();
  Header.addSearchKeyUpEventListener();
  Header.addSearchPostEventListener();

  newsfeedClass.setUser(); // setting logged in user info for class usage
  newsfeedClass.setUserData(); // setting user data in side profile

  newsfeedClass.handleNewsfeedLoaders(); // will set the styling of loaders i.e., d-none to display data

  const response = await newsfeedClass.setAllPosts();
  if (response.error) {
    if (response.error.includes("no posts")) {
      // search.hidePostLoader();
      // search.showError(response.error);
    }
    return;
  }

  newsfeedClass.addScrollEventListener(); // setting scroll event listener for getting more posts

  Modal.addDeleteModalEventListener();

  // this is a custom event. it is triggered every time when the last
  // post is on screen. see 'addScrollEventListener()' in newsfeed class.
  document.addEventListener("handleNewPosts", async () => {
    Post.setSkip(Post.getSkip() + Post.getLimit()); // updating the skip value to get next 10 posts
    await newsfeedClass.setAllPosts(); // getting the next 10 posts
    newsfeedClass.addScrollEventListener(); // setting scroll event listener for getting more posts
  });
})();

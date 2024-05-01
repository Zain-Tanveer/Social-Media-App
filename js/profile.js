import AuthenticateClass from "./classes/Authenticate.class.js";
import NewsfeedClass from "./classes/Newsfeed.class.js";
import Modal from "./classes/Modal.class.js";
import Header from "./classes/Header.class.js";
import Profile from "./classes/Profile.class.js";

// this will remove the hardcoded html in posts.
document.getElementById("posts").innerHTML = "";

// authenticates user. if failed will redirect
await AuthenticateClass.isAuthenticated();

const profile = new Profile();

(async () => {
  profile.handleUserIdParam(); // handling user id from query string

  // setting user profile data
  const response = await profile.setUserProfile();
  if (response.error) {
    return;
  }

  Header.setProfileSettingsUser(); // setting the html of user in profile settings dropdown
  Header.enableUserSettings(); // enabling the profile settings dropdown button.
  Header.addLogoutEventListener(); // adding logout event listener on logout click

  NewsfeedClass.setUser(); // setting logged in user info for class usage

  profile.setUserIntro(); // setting user information in intro
  profile.showUserIntro(); // showing user intro element
  profile.hideIntroLoader(); // hiding intro loader

  // if the profile is of the current logged in user
  if (profile.user.id === NewsfeedClass.user.id) {
    profile.setSaySomethingInfo(); // setting user info in say something
    profile.showSaySomething(); // showing say something
    profile.hideSaySomethingPlaceholder(); // hiding say something placeholder
    document.getElementById("profile-options-logged-user").classList.remove("d-none");
  } else {
    profile.removeSaySomethingElement(); // if not current logged in user then remove say something element
    document.getElementById("profile-options-other-users").classList.remove("d-none");
  }

  // this checks if the screen width is less than 960px.
  // this is for the search dropdown on mobile screens
  if (document.body.clientWidth <= 960) {
    const containerEl = document.querySelector(".search-dropdown");
    Header.setContainerElement(containerEl);
  }

  Header.addSearchEventListener(); // adding focus event listener on search input field to display the dropdown
  Header.addSearchKeyUpEventListener(); // adding keyup event listener on search input field
  Header.addSearchPostEventListener(); // adding click event listener on the first item displayed in search dropdown

  // setting user posts
  const responsePosts = await profile.setUserPosts();
  if (responsePosts.error) {
    if (responsePosts.error.includes("no posts")) {
      profile.hidePostLoader(); // hiding post loader
      profile.showError(responsePosts.error); // if no posts then show no posts
    }
    return;
  }

  profile.addScrollEventListener(); // setting scroll event listener for getting more posts

  Modal.addDeleteModalEventListener(); // adding click event listener on delete comment

  // this is a custom event. it is triggered every time when the last
  // post is on screen. see 'addScrollEventListener()' in profile class.
  document.addEventListener("handleNewPosts", async () => {
    profile.setSkip(profile.getSkip() + profile.getLimit()); // updating the skip value to get next 10 posts
    if (profile.getSkip() < profile.getTotal()) {
      await profile.setUserPosts(); // getting the next 10 posts
      profile.addScrollEventListener(); // setting scroll event listener for getting more posts
    } else {
      profile.hidePostLoader();
    }
  });
})();

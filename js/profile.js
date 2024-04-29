import AuthenticateClass from "./classes/Authenticate.class.js";
import NewsfeedClass from "./classes/Newsfeed.class.js";
import Modal from "./classes/Modal.class.js";
import Header from "./classes/Header.class.js";
import Profile from "./classes/Profile.class.js";

document.getElementById("posts").innerHTML = "";

await AuthenticateClass.isAuthenticated();

const profile = new Profile();

(async () => {
  profile.handleUserIdParam();

  const response = await profile.setUserProfile();
  if (response.error) {
    return;
  }

  Header.setProfileSettingsUser();
  Header.enableUserSettings();
  Header.addLogoutEventListener();

  NewsfeedClass.setUser(); // setting logged in user info for class usage

  profile.setUserIntro();
  profile.showUserIntro();
  profile.hideIntroLoader();

  if (profile.user.id === NewsfeedClass.user.id) {
    profile.setSaySomethingInfo();
    profile.showSaySomething();
    profile.hideSaySomethingPlaceholder();
    document.getElementById("profile-options-logged-user").classList.remove("d-none");
  } else {
    profile.removeSaySomethingElement();
    document.getElementById("profile-options-other-users").classList.remove("d-none");
  }

  if (document.body.clientWidth <= 960) {
    const containerEl = document.querySelector(".search-dropdown");
    Header.setContainerElement(containerEl);
  }

  Header.addSearchEventListener();
  Header.addSearchKeyUpEventListener();
  Header.addSearchPostEventListener();

  const responsePosts = await profile.setUserPosts();
  if (responsePosts.error) {
    if (responsePosts.error.includes("no posts")) {
      profile.hidePostLoader();
      profile.showError(responsePosts.error);
    }
    return;
  }

  profile.addScrollEventListener(); // setting scroll event listener for getting more posts

  Modal.addDeleteModalEventListener();

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

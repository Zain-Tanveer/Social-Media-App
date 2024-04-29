import AuthenticateClass from "./classes/Authenticate.class.js";
import NewsfeedClass from "./classes/Newsfeed.class.js";
import Modal from "./classes/Modal.class.js";
import Header from "./classes/Header.class.js";
import Search from "./classes/Search.class.js";

document.getElementById("posts").innerHTML = "";

await AuthenticateClass.isAuthenticated();

(async () => {
  const search = new Search();
  search.handleSearchParam();
  search.setSearchResultsFor();
  search.hideSideNavLoader();
  search.showSideNav();

  Header.setProfileSettingsUser();
  Header.enableUserSettings();
  Header.addLogoutEventListener();

  if (document.body.clientWidth <= 960) {
    const containerEl = document.querySelector(".search-dropdown");
    Header.setContainerElement(containerEl);
  }

  Header.addSearchEventListener();
  Header.addSearchKeyUpEventListener();
  search.addSearchPostEventListener(Header.getContainerElement());

  NewsfeedClass.setUser(); // setting logged in user info for class usage

  const response = await search.setAllPosts();
  if (response.error) {
    if (response.error.includes("no posts")) {
      search.hidePostLoader();
      search.showError(response.error);
    }
    return;
  }

  search.addScrollEventListener(); // setting scroll event listener for getting more posts

  Modal.addDeleteModalEventListener();

  // this is a custom event. it is triggered every time when the last
  // post is on screen. see 'addScrollEventListener()' in search class.
  document.addEventListener("handleNewPosts", async () => {
    search.setSkip(search.getSkip() + search.getLimit()); // updating the skip value to get next 10 posts
    if (search.getSkip() < search.getTotal()) {
      await search.setAllPosts(); // getting the next 10 posts
      search.addScrollEventListener(); // setting scroll event listener for getting more posts
    } else {
      search.hidePostLoader();
    }
  });
})();

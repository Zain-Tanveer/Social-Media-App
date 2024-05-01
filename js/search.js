import AuthenticateClass from "./classes/Authenticate.class.js";
import NewsfeedClass from "./classes/Newsfeed.class.js";
import Modal from "./classes/Modal.class.js";
import Header from "./classes/Header.class.js";
import Search from "./classes/Search.class.js";

// this will remove the hardcoded html in posts.
document.getElementById("posts").innerHTML = "";

// authenticates user. if failed will redirect
await AuthenticateClass.isAuthenticated();

(async () => {
  const search = new Search();
  search.handleSearchParam(); // handles search query from query strings
  search.setSearchResultsFor(); // setting search results for text
  search.hideSideNavLoader(); // hiding side navigation loader
  search.showSideNav(); // showing side navigation

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
  search.addSearchPostEventListener(Header.getContainerElement()); // adding click event listener on the first item displayed in search dropdown

  NewsfeedClass.setUser(); // setting logged in user info for class usage

  // setting all searched posts
  const response = await search.setAllPosts();
  if (response.error) {
    if (response.error.includes("no posts")) {
      search.hidePostLoader(); // hiding post loader
      search.showError(response.error); // if no posts then show no posts
    }
    return;
  }

  search.addScrollEventListener(); // setting scroll event listener for getting more posts

  Modal.addDeleteModalEventListener(); // adding click event listener on delete comment

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

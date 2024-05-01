import Post from "./Post.class.js";
import UserClass, { User } from "./User.class.js";

class Header {
  static #containerElement = document.querySelector(".user-search-container");
  static #searchPostElement = document.querySelector(".search-post");
  static #searchUserElement = document.querySelector(".search-user");

  static #timeoutId;

  constructor() {}

  // function to set search dropdown container element
  // based on screen width
  static setContainerElement(element) {
    Header.#containerElement = element;
  }

  // function to get search dropdown container element
  static getContainerElement() {
    return Header.#containerElement;
  }

  // function to add event listener on search input field
  static addSearchEventListener() {
    const postSearchEl = document.querySelector(".user-search-container #post-search");
    const searchDropdownEl = document.querySelector(".user-search-container #search-lg-dropdown");

    postSearchEl.addEventListener("focus", () => {
      searchDropdownEl.classList.remove("d-none");
    });

    document.addEventListener("click", () => {
      if (document.activeElement !== postSearchEl) {
        searchDropdownEl.classList.add("d-none");
      }
    });
  }

  // function to add event listener on key up on search input field
  static addSearchKeyUpEventListener() {
    const postSearchEl = Header.#containerElement.querySelector("#post-search");
    postSearchEl.removeAttribute("disabled");

    const postsEl = Header.#containerElement.querySelector("#search-posts");
    const usersEl = Header.#containerElement.querySelector("#search-users");

    postsEl.innerHTML = "";
    usersEl.innerHTML = "";

    postSearchEl.addEventListener("keyup", async (e) => {
      const isAlphabet = /^[a-zA-Z]$/.test(e.key);
      const isNumber = /^[0-9]$/.test(e.key);

      // if key pressed is an alphabet, number or backspace key
      if (isAlphabet || isNumber || e.key === "Backspace") {
        if (postSearchEl.value !== "") {
          Header.hideNoResultsElement(); // hiding no results
          Header.setSearchTextElement(postSearchEl); // setting text of first item in search dropdown

          clearTimeout(Header.#timeoutId); // if set timeout exists then clear timeout

          // if both search posts and search users are empty
          if (
            Header.#containerElement.querySelector("#search-posts").innerHTML === "" &&
            Header.#containerElement.querySelector("#search-users").innerHTML === ""
          ) {
            Header.showLoader();
          }

          // wait 1 second before making api calls.
          // this is to ensure that if user types a bunch of characters really fast,
          // the api calls don't get clogged.
          Header.#timeoutId = setTimeout(async () => {
            await Header.setSearchPosts(postSearchEl); // set post items in search dropdown
            await Header.setSearchUsers(postSearchEl); // set user items in search dropdown
          }, 1000);
          // if search input field is empty
        } else {
          Header.hideSearchTextElement();
          Header.showNoResultsElement();
          Header.hideLoader();

          Header.#containerElement.querySelector("#search-posts").innerHTML = "";
          Header.#containerElement.querySelector("#search-users").innerHTML = "";
        }
      }
    });
  }

  // function to set profile user info in profile settings dropdown
  static setProfileSettingsUser() {
    const user = UserClass.getUser();

    const imageEl = document.querySelector("#profile-settings-user img");
    imageEl.setAttribute("src", user.image);
    imageEl.setAttribute("alt", user.username);

    const nameEl = document.querySelector("#profile-settings-user p");
    nameEl.innerHTML = user.username;

    // on click of user info in profile settings redirect user to profile page
    const settingsUserEl = document.getElementById("profile-settings-user");
    settingsUserEl.addEventListener("click", () => {
      window.location.href = `../html/profile.html?id=${user.id}`;
    });
  }

  // function to add event listener on logout button in profile settings
  static addLogoutEventListener() {
    const logoutEl = document.getElementById("logout");
    logoutEl.addEventListener("click", () => {
      console.log("click");
      UserClass.logoutUser();
    });
  }

  // function to set search text in the first of search dropdown
  static setSearchTextElement(postSearchEl) {
    const searchTextEl = Header.#containerElement.querySelector("#search-text");
    searchTextEl.innerHTML = postSearchEl.value;

    Header.showSearchTextElement();
  }

  // function to enable user settings dropdown icon
  static enableUserSettings() {
    const buttonEl = document.getElementById("profile-settings-button");
    buttonEl.disabled = false;
  }

  // function to hide no results element
  static hideNoResultsElement() {
    const noResultsEl = Header.#containerElement.querySelector("#no-results");
    noResultsEl.classList.add("d-none");
  }

  // function to show no results element
  static showNoResultsElement() {
    const noResultsEl = Header.#containerElement.querySelector("#no-results");
    noResultsEl.classList.remove("d-none");
  }

  // function to hide search text element
  static hideSearchTextElement() {
    const searchPostTextEl = Header.#containerElement.querySelector("#search-post-text");
    searchPostTextEl.classList.add("d-none");
  }

  // function to show search text element
  static showSearchTextElement() {
    const searchPostTextEl = Header.#containerElement.querySelector("#search-post-text");
    searchPostTextEl.classList.remove("d-none");
  }

  // function to hide search dropdown loader
  static showLoader() {
    const spinnerEl = Header.#containerElement.querySelector("#search-spinner");
    spinnerEl.classList.remove("d-none");
  }

  // function to show search dropdown loader
  static hideLoader() {
    const spinnerEl = Header.#containerElement.querySelector("#search-spinner");
    spinnerEl.classList.add("d-none");
  }

  // function to add event listener on search post text click
  static addSearchPostEventListener() {
    const searchEl = Header.#containerElement.querySelector("#search-post-text");
    searchEl.addEventListener("click", () => {
      const searchTextEl = Header.#containerElement.querySelector("#search-text");
      window.open(`../html/search.html?q=${searchTextEl.innerHTML}`, "_blank");
    });
  }

  // function to set search posts elements
  static async setSearchPosts(searchEl) {
    if (searchEl.value !== "") {
      const data = await Post.getSearchPosts(searchEl.value); // getting all posts based on search value

      if (!data.error) {
        const searchPostsEl = Header.#containerElement.querySelector("#search-posts");

        const posts = data.posts;
        if (posts.length > 0) {
          searchPostsEl.innerHTML = "";

          for (const post of posts) {
            const postEl = Header.#searchPostElement.cloneNode(true); // cloning post element for search dropdown
            postEl.classList.remove("d-none");

            const postTitleEl = postEl.querySelector(".search-post-title");
            postTitleEl.innerHTML = post.title;

            const postBodyEl = postEl.querySelector(".search-post-body");
            postBodyEl.innerHTML = post.body;

            // adding event listener on click of search post
            postEl.addEventListener("click", () => {
              window.open(`../html/search.html?q=${searchEl.value}&postId=${post.id}`, "_blank");
            });

            searchPostsEl.appendChild(postEl);
          }

          Header.hideLoader();
        } else {
          searchPostsEl.innerHTML = "";
          Header.hideLoader();
        }
      }
    }
  }

  // function to set search user elements
  static async setSearchUsers(searchEl) {
    if (searchEl.value !== "") {
      const data = await User.getSearchUsers(searchEl.value); // getting users based on search input

      if (!data.error) {
        const users = data.users;
        const searchUsersEl = Header.#containerElement.querySelector("#search-users");
        if (users.length > 0) {
          searchUsersEl.innerHTML = "";

          for (const user of users) {
            const userEl = Header.#searchUserElement.cloneNode(true); // cloning user element for search dropdown
            userEl.classList.remove("d-none");

            const imageEl = userEl.querySelector(".search-user-image");
            imageEl.setAttribute("src", user.image);
            imageEl.setAttribute("alt", user.username);

            const fullNameEl = userEl.querySelector(".search-user-fullname");
            fullNameEl.innerHTML = `${user.firstName} ${user.lastName}`;

            const usernameEl = userEl.querySelector(".search-user-username");
            usernameEl.innerHTML = user.username;

            // adding event listener on click of search user
            userEl.addEventListener("click", () => {
              window.open(`../html/profile.html?id=${user.id}`, "_blank");
            });

            searchUsersEl.appendChild(userEl);
          }

          Header.hideLoader();
        } else {
          searchUsersEl.innerHTML = "";
          Header.hideLoader();
        }
      }
    }
  }
}

export default Header;

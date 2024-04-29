import Post from "./Post.class.js";
import UserClass, { User } from "./User.class.js";

class Header {
  static #containerElement = document.querySelector(".user-search-container");
  static #searchPostElement = document.querySelector(".search-post");
  static #searchUserElement = document.querySelector(".search-user");

  static #timeoutId;

  constructor() {}

  static setContainerElement(element) {
    Header.#containerElement = element;
  }

  static getContainerElement() {
    return Header.#containerElement;
  }

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

  static addSearchKeyUpEventListener() {
    const postSearchEl = Header.#containerElement.querySelector("#post-search");
    postSearchEl.removeAttribute("disabled");

    const postsEl = Header.#containerElement.querySelector("#search-posts");
    const usersEl = Header.#containerElement.querySelector("#search-posts");

    postsEl.innerHTML = "";
    usersEl.innerHTML = "";

    postSearchEl.addEventListener("keyup", async (e) => {
      const isAlphabet = /^[a-zA-Z]$/.test(e.key);
      const isNumber = /^[0-9]$/.test(e.key);

      if (isAlphabet || isNumber || e.key === "Backspace") {
        if (postSearchEl.value !== "") {
          Header.hideNoResultsElement();
          Header.setSearchTextElement(postSearchEl);

          clearTimeout(Header.#timeoutId);

          if (
            Header.#containerElement.querySelector("#search-posts").innerHTML === "" &&
            Header.#containerElement.querySelector("#search-posts").innerHTML === ""
          ) {
            Header.showLoader();
          }

          Header.#timeoutId = setTimeout(async () => {
            await Header.setSearchPosts(postSearchEl);
            await Header.setSearchUsers(postSearchEl);
          }, 1000);
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

  static setProfileSettingsUser() {
    const user = UserClass.getUser();

    const imageEl = document.querySelector("#profile-settings-user img");
    imageEl.setAttribute("src", user.image);
    imageEl.setAttribute("alt", user.username);

    const nameEl = document.querySelector("#profile-settings-user p");
    nameEl.innerHTML = user.username;

    const settingsUserEl = document.getElementById("profile-settings-user");
    settingsUserEl.addEventListener("click", () => {
      window.location.href = `/html/profile.html?id=${user.id}`;
    });
  }

  static addLogoutEventListener() {
    const logoutEl = document.getElementById("logout");
    logoutEl.addEventListener("click", () => {
      console.log("click");
      UserClass.logoutUser();
    });
  }

  static setSearchTextElement(postSearchEl) {
    const searchTextEl = Header.#containerElement.querySelector("#search-text");
    searchTextEl.innerHTML = postSearchEl.value;

    Header.showSearchTextElement();
  }

  static enableUserSettings() {
    const buttonEl = document.getElementById("profile-settings-button");
    buttonEl.disabled = false;
  }

  static hideNoResultsElement() {
    const noResultsEl = Header.#containerElement.querySelector("#no-results");
    noResultsEl.classList.add("d-none");
  }

  static showNoResultsElement() {
    const noResultsEl = Header.#containerElement.querySelector("#no-results");
    noResultsEl.classList.remove("d-none");
  }

  static hideSearchTextElement() {
    const searchPostTextEl = Header.#containerElement.querySelector("#search-post-text");
    searchPostTextEl.classList.add("d-none");
  }

  static showSearchTextElement() {
    const searchPostTextEl = Header.#containerElement.querySelector("#search-post-text");
    searchPostTextEl.classList.remove("d-none");
  }

  static showLoader() {
    const spinnerEl = Header.#containerElement.querySelector("#search-spinner");
    spinnerEl.classList.remove("d-none");
  }

  static hideLoader() {
    const spinnerEl = Header.#containerElement.querySelector("#search-spinner");
    spinnerEl.classList.add("d-none");
  }

  static addSearchPostEventListener() {
    const searchEl = Header.#containerElement.querySelector("#search-post-text");
    searchEl.addEventListener("click", () => {
      const searchTextEl = Header.#containerElement.querySelector("#search-text");
      window.open(`/html/search.html?q=${searchTextEl.innerHTML}`, "_blank");
    });
  }

  static async setSearchPosts(searchEl) {
    if (searchEl.value !== "") {
      const data = await Post.getSearchPosts(searchEl.value);

      if (!data.error) {
        const searchPostsEl = Header.#containerElement.querySelector("#search-posts");

        const posts = data.posts;
        if (posts.length > 0) {
          searchPostsEl.innerHTML = "";

          for (const post of posts) {
            const postEl = Header.#searchPostElement.cloneNode(true);
            postEl.classList.remove("d-none");

            const postTitleEl = postEl.querySelector(".search-post-title");
            postTitleEl.innerHTML = post.title;

            const postBodyEl = postEl.querySelector(".search-post-body");
            postBodyEl.innerHTML = post.body;

            postEl.addEventListener("click", () => {
              window.open(`/html/search.html?q=${searchEl.value}&postId=${post.id}`, "_blank");
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

  static async setSearchUsers(searchEl) {
    if (searchEl.value !== "") {
      const data = await User.getSearchUsers(searchEl.value);

      if (!data.error) {
        const users = data.users;
        const searchUsersEl = Header.#containerElement.querySelector("#search-users");
        if (users.length > 0) {
          searchUsersEl.innerHTML = "";

          for (const user of users) {
            const userEl = Header.#searchUserElement.cloneNode(true);
            userEl.classList.remove("d-none");

            const imageEl = userEl.querySelector(".search-user-image");
            imageEl.setAttribute("src", user.image);
            imageEl.setAttribute("alt", user.username);

            const fullNameEl = userEl.querySelector(".search-user-fullname");
            fullNameEl.innerHTML = `${user.firstName} ${user.lastName}`;

            const usernameEl = userEl.querySelector(".search-user-username");
            usernameEl.innerHTML = user.username;

            userEl.addEventListener("click", () => {
              window.open(`/html/profile.html?id=${user.id}`, "_blank");
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

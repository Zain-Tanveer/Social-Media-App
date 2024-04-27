import Post from "./Post.class.js";
import { User } from "./User.class.js";

class Header {
  static #searchPostElement = document.querySelector(".search-post");
  static #searchUserElement = document.querySelector(".search-user");

  static #timeoutId;

  constructor() {}

  static addSearchEventListener() {
    const postSearchEl = document.getElementById("post-search");
    const searchLgDropdownEl = document.getElementById("search-lg-dropdown");

    postSearchEl.removeAttribute("disabled");

    postSearchEl.addEventListener("focus", () => {
      searchLgDropdownEl.classList.remove("d-none");
    });

    document.addEventListener("click", () => {
      if (document.activeElement !== postSearchEl) {
        searchLgDropdownEl.classList.add("d-none");
      }
    });
  }

  static addSearchKeyUpEventListener() {
    const postSearchEl = document.getElementById("post-search");

    const postsEl = document.getElementById("search-posts");
    const usersEl = document.getElementById("search-posts");

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
            document.getElementById("search-posts").innerHTML === "" &&
            document.getElementById("search-posts").innerHTML === ""
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

          document.getElementById("search-posts").innerHTML = "";
          document.getElementById("search-users").innerHTML = "";
        }
      }
    });
  }

  static setSearchTextElement(postSearchEl) {
    const searchTextEl = document.getElementById("search-text");
    searchTextEl.innerHTML = postSearchEl.value;

    Header.showSearchTextElement();
  }

  static hideNoResultsElement() {
    const noResultsEl = document.getElementById("no-results");
    noResultsEl.classList.add("d-none");
  }

  static showNoResultsElement() {
    const noResultsEl = document.getElementById("no-results");
    noResultsEl.classList.remove("d-none");
  }

  static hideSearchTextElement() {
    const searchPostTextEl = document.getElementById("search-post-text");
    searchPostTextEl.classList.add("d-none");
  }

  static showSearchTextElement() {
    const searchPostTextEl = document.getElementById("search-post-text");
    searchPostTextEl.classList.remove("d-none");
  }

  static showLoader() {
    const spinnerEl = document.getElementById("search-spinner");
    spinnerEl.classList.remove("d-none");
  }

  static hideLoader() {
    const spinnerEl = document.getElementById("search-spinner");
    spinnerEl.classList.add("d-none");
  }

  static addSearchPostEventListener() {
    const searchEl = document.getElementById("search-post-text");
    searchEl.addEventListener("click", () => {
      const searchTextEl = document.getElementById("search-text");
      window.open(`/html/search.html?q=${searchTextEl.innerHTML}`, "_blank");
    });
  }

  static async setSearchPosts(searchEl) {
    if (searchEl.value !== "") {
      const data = await Post.getSearchPosts(searchEl.value);

      if (!data.error) {
        const searchPostsEl = document.getElementById("search-posts");

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
        const searchUsersEl = document.getElementById("search-users");
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

import Post from "./Post.class.js";
import UserClass from "./User.class.js";
import CommentClass from "./Comment.class.js";

class Search {
  static #lastPostId;

  constructor() {
    this.total;
    this.limit = 10;
    this.skip = 0;
    this.searchParam = "";
  }

  // function to set last post id
  static setLastPostId(postId) {
    Search.#lastPostId = postId;
  }

  // function to get last post id
  static getLastPostId() {
    return Search.#lastPostId;
  }

  // function to get total value
  getTotal() {
    return this.total;
  }

  // function to set limit value
  setLimit(limit) {
    this.limit = limit;
  }

  // function to get limit value
  getLimit() {
    return this.limit;
  }

  // function to set skip value
  setSkip(skip) {
    this.skip = skip;
  }

  // function to get skip value
  getSkip() {
    return this.skip;
  }

  // function to set search params value
  setSearchParams(value) {
    this.searchParam = value;
  }

  // function to get search params value
  getSearchParams() {
    return this.searchParam;
  }

  // function to handle search query
  handleSearchParam() {
    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString);
    const paramValue = queryParams.get("q");

    // if search query exists then set its value
    // else all posts will be searched and displayed
    if (paramValue) {
      this.setSearchParams(paramValue);
    }
  }

  // function to set the value of search results for
  setSearchResultsFor() {
    const resultsForEl = document.getElementById("results-for");
    console.log(this.getSearchParams());
    if (this.getSearchParams() === "") {
      resultsForEl.innerHTML = " ";
    } else {
      resultsForEl.innerHTML = this.getSearchParams();
    }
  }

  // function to show side navigation
  showSideNav() {
    const sideNavEl = document.getElementById("side-nav-content");
    sideNavEl.classList.remove("d-none");
  }

  // function to hide side navigation loader
  hideSideNavLoader() {
    const sideNavLoaderEl = document.getElementById("side-nav-placeholder");
    sideNavLoaderEl.classList.add("d-none");
  }

  // function to show post loader
  showPostLoader() {
    const postLoaderEl = document.getElementById("placeholder-post");
    postLoaderEl.classList.remove("d-none");
  }

  // function to hide post loader
  hidePostLoader() {
    const postLoaderEl = document.getElementById("placeholder-post");
    postLoaderEl.classList.add("d-none");
  }

  // function to show error text
  showError(text) {
    const errorEl = document.getElementById("error");
    errorEl.innerHTML = text;
    errorEl.classList.remove("d-none");
  }

  // function to set all searched posts
  async setAllPosts() {
    try {
      // getting all posts based on search parameter
      const response = await Post.getSearchPosts(this.searchParam, this.limit, this.skip);

      if (response.error) {
        throw new Error(response.error);
      }

      const { posts, total } = response;

      if (total === 0) {
        throw new Error("no posts found.");
      }

      // setting last post id for scrolling
      Search.setLastPostId(posts[posts.length - 1].id);
      this.total = total;

      for (const post of posts) {
        // getting user for each post.
        // this is to get specific user info for header of each post
        const user = await UserClass.getSingleUser(post.userId);

        if (user.error) {
          throw new Error(user.error);
        }

        // getting all comments for each post
        const response = await CommentClass.getPostComments(post.id);

        if (response.error) {
          throw new Error(response.error);
        }

        // creates a new Post object
        const postObj = new Post(post, user, response.comments);
        postObj.createNewPost(); // creates new post and appends it to the posts element
      }

      return {};
    } catch (error) {
      return { error: error.message };
    }
  }

  // function to add event listener on search post text in the search dropdown
  addSearchPostEventListener(containerEl) {
    const searchEl = containerEl.querySelector("#search-post-text");
    searchEl.addEventListener("click", () => {
      const searchTextEl = containerEl.querySelector("#search-text");
      window.location.href = `../html/search.html?q=${searchTextEl.innerHTML}`;
    });
  }

  // function to add scroll event listener for getting more posts
  addScrollEventListener() {
    document.body.addEventListener("scroll", Search.handleScrollEventListener);
  }

  // function to handle scroll event listener
  static handleScrollEventListener() {
    const postEl = document.getElementById(`post-${Search.#lastPostId}`); // gets current last post
    if (postEl) {
      // creates a custom event.
      // this custom event is handled in search.js
      const customEvent = new Event("handleNewPosts");

      // function to check if element is in viewport
      function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return rect.top < 0;
      }

      // checks if last post is in view
      if (isInViewport(postEl)) {
        document.dispatchEvent(customEvent); // triggers the custom event
        document.body.removeEventListener("scroll", Search.handleScrollEventListener);
      }
    }
  }
}

export default Search;

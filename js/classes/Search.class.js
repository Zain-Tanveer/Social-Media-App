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

  static setLastPostId(postId) {
    Search.#lastPostId = postId;
  }

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

  setSearchParams(value) {
    this.searchParam = value;
  }

  getSearchParams() {
    return this.searchParam;
  }

  handleSearchParam() {
    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString);
    const paramValue = queryParams.get("q");

    if (paramValue) {
      this.setSearchParams(paramValue);
    }
  }

  setSearchResultsFor() {
    const resultsForEl = document.getElementById("results-for");
    console.log(this.getSearchParams());
    if (this.getSearchParams() === "") {
      resultsForEl.innerHTML = " ";
    } else {
      resultsForEl.innerHTML = this.getSearchParams();
    }
  }

  showSideNav() {
    const sideNavEl = document.getElementById("side-nav-content");
    sideNavEl.classList.remove("d-none");
  }

  hideSideNavLoader() {
    const sideNavLoaderEl = document.getElementById("side-nav-placeholder");
    sideNavLoaderEl.classList.add("d-none");
  }

  showPostLoader() {
    const postLoaderEl = document.getElementById("placeholder-post");
    postLoaderEl.classList.remove("d-none");
  }

  hidePostLoader() {
    const postLoaderEl = document.getElementById("placeholder-post");
    postLoaderEl.classList.add("d-none");
  }

  showError(text) {
    const errorEl = document.getElementById("error");
    errorEl.innerHTML = text;
    errorEl.classList.remove("d-none");
  }

  async setAllPosts() {
    try {
      const response = await Post.getSearchPosts(this.searchParam, this.limit, this.skip);

      if (response.error) {
        throw new Error(response.error);
      }

      console.log(response);

      const { posts, total } = response;

      if (total === 0) {
        throw new Error("no posts found.");
      }

      Search.setLastPostId(posts[posts.length - 1].id);
      this.total = total;

      for (const post of posts) {
        const user = await UserClass.getSingleUser(post.userId);
        const response = await CommentClass.getPostComments(post.id);

        const postObj = new Post(post, user, response.comments);
        postObj.createNewPost();
      }

      return {};
    } catch (error) {
      return { error: error.message };
    }
  }

  addSearchPostEventListener(containerEl) {
    const searchEl = containerEl.querySelector("#search-post-text");
    searchEl.addEventListener("click", () => {
      const searchTextEl = containerEl.querySelector("#search-text");
      window.location.href = `/html/search.html?q=${searchTextEl.innerHTML}`;
    });
  }

  addScrollEventListener() {
    document.body.addEventListener("scroll", Search.handleScrollEventListener);
  }

  static handleScrollEventListener() {
    const postEl = document.getElementById(`post-${Search.#lastPostId}`);
    if (postEl) {
      const customEvent = new Event("handleNewPosts");

      // function to check if element is in viewport
      function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return rect.top < 0;
      }

      if (isInViewport(postEl)) {
        document.dispatchEvent(customEvent);
        document.body.removeEventListener("scroll", Search.handleScrollEventListener);
      }
    }
  }
}

export default Search;

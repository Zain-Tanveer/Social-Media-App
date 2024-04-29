import Post from "./Post.class.js";
import UserClass from "./User.class.js";
import CommentClass from "./Comment.class.js";

class Profile {
  static #lastPostId;

  constructor() {
    this.total;
    this.limit = 10;
    this.skip = 0;
    this.userIdParams = "";
    this.user = {};
  }

  static setLastPostId(postId) {
    Profile.#lastPostId = postId;
  }

  static getLastPostId() {
    return Profile.#lastPostId;
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

  setUserIdParams(value) {
    this.userIdParams = value;
  }

  getUserIdParams() {
    return this.userIdParams;
  }

  setUser(user) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  handleUserIdParam() {
    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString);
    const paramValue = queryParams.get("id");

    if (paramValue) {
      this.setUserIdParams(paramValue);
    }
  }

  setProfileFullName() {
    const fullNameEl = document.getElementById("profile-fullname");
    fullNameEl.innerHTML = `${this.user.firstName} ${this.user.lastName}`;
  }

  setProfileUsername() {
    const fullNameEl = document.getElementById("profile-username");
    fullNameEl.innerHTML = this.user.username;
  }

  setProfileImage() {
    const profileImageEl = document.getElementById("profile-image");
    profileImageEl.setAttribute("src", this.user.image);
    profileImageEl.setAttribute("alt", this.user.username);
  }

  setUserIntro() {
    const universityEl = document.getElementById("user-university");
    universityEl.innerHTML = this.user.university;

    const dobEl = document.getElementById("user-dob");
    dobEl.innerHTML = this.user.birthDate;

    const locationEl = document.getElementById("user-location");
    locationEl.innerHTML = `${this.user.address.city}, ${this.user.address.state}`;

    const companyEl = document.getElementById("user-company");
    companyEl.innerHTML = this.user.company.name;
  }

  setSaySomethingInfo() {
    const imageEl = document.getElementById("search-image");
    imageEl.setAttribute("src", this.user.image);
    imageEl.setAttribute("alt", this.user.username);

    const nameEl = document.getElementById("search-username");
    nameEl.innerHTML = this.user.firstName;
  }

  showUserProfile() {
    const profileEl = document.getElementById("user-profile");
    profileEl.classList.remove("d-none");
  }

  showUserIntro() {
    const introEl = document.getElementById("intro");
    introEl.classList.remove("d-none");
  }

  hideUserProfileLoader() {
    const profileLoaderEl = document.getElementById("user-profile-placeholder");
    profileLoaderEl.classList.add("d-none");
  }

  hideIntroLoader() {
    const introLoaderEl = document.getElementById("intro-placeholder");
    introLoaderEl.classList.add("d-none");
  }

  showPostLoader() {
    const postLoaderEl = document.getElementById("placeholder-post");
    postLoaderEl.classList.remove("d-none");
  }

  hidePostLoader() {
    const postLoaderEl = document.getElementById("placeholder-post");
    postLoaderEl.classList.add("d-none");
  }

  showSaySomething() {
    const saySomethingEl = document.getElementById("say-something");
    saySomethingEl.classList.remove("d-none");
  }

  hideSaySomethingPlaceholder() {
    const saySomethingPlaceholderEL = document.getElementById("say-something-placeholder");
    saySomethingPlaceholderEL.classList.add("d-none");
  }

  removeSaySomethingElement() {
    const saySomethingEl = document.getElementById("say-something-container");
    saySomethingEl.parentElement.removeChild(saySomethingEl);
  }

  showError(text) {
    const errorEl = document.getElementById("error");
    // errorEl.innerHTML = text;
    // errorEl.classList.remove("d-none");
  }

  async setUserProfile() {
    try {
      const response = await UserClass.getSingleUser(parseInt(this.userIdParams));

      if (response.error) {
        throw new Error(response.error);
      }
      console.log(response);

      this.user = response;

      this.setProfileImage();
      this.setProfileFullName();
      this.setProfileUsername();
      this.hideUserProfileLoader();
      this.showUserProfile();

      return {};
    } catch (error) {
      return { error: error.message };
    }
  }

  async setUserPosts() {
    try {
      const response = await Post.getUserPosts(this.user.id, this.limit, this.skip);
      console.log(response);

      if (response.error) {
        throw new Error(response.error);
      }

      const { posts, total } = response;

      if (total === 0) {
        throw new Error("no posts found.");
      }

      Profile.setLastPostId(posts[posts.length - 1].id);
      this.total = total;

      for (const post of posts) {
        const response = await CommentClass.getPostComments(post.id);

        const postObj = new Post(post, this.user, response.comments);
        postObj.createNewPost();
      }

      return {};
    } catch (error) {
      return { error: error.message };
    }
  }

  addScrollEventListener() {
    document.body.addEventListener("scroll", Profile.handleScrollEventListener);
  }

  static handleScrollEventListener() {
    const postEl = document.getElementById(`post-${Profile.#lastPostId}`);
    if (postEl) {
      const customEvent = new Event("handleNewPosts");

      // function to check if element is in viewport
      function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return rect.top < 0;
      }

      if (isInViewport(postEl)) {
        document.dispatchEvent(customEvent);
        document.body.removeEventListener("scroll", Profile.handleScrollEventListener);
      }
    }
  }
}

export default Profile;

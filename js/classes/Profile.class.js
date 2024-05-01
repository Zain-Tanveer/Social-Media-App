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

  // function to set last post id
  static setLastPostId(postId) {
    Profile.#lastPostId = postId;
  }

  // function to get last post id
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

  // function to set user id params
  setUserIdParams(value) {
    this.userIdParams = value;
  }

  // function to get user id params
  getUserIdParams() {
    return this.userIdParams;
  }

  // function to set user
  setUser(user) {
    this.user = user;
  }

  // function to get user
  getUser() {
    return this.user;
  }

  // function to handle user id param
  handleUserIdParam() {
    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString);
    const paramValue = queryParams.get("id");

    if (paramValue) {
      this.setUserIdParams(paramValue);
    }
  }

  // function to set full name on user profile section
  setProfileFullName() {
    const fullNameEl = document.getElementById("profile-fullname");
    fullNameEl.innerHTML = `${this.user.firstName} ${this.user.lastName}`;
  }

  // function to set username on user profile section
  setProfileUsername() {
    const fullNameEl = document.getElementById("profile-username");
    fullNameEl.innerHTML = this.user.username;
  }

  // function to set user image on user profile section
  setProfileImage() {
    const profileImageEl = document.getElementById("profile-image");
    profileImageEl.setAttribute("src", this.user.image);
    profileImageEl.setAttribute("alt", this.user.username);
  }

  // function to set intro information on intro section
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

  // function to set say something info
  setSaySomethingInfo() {
    const imageEl = document.getElementById("search-image");
    imageEl.setAttribute("src", this.user.image);
    imageEl.setAttribute("alt", this.user.username);

    const nameEl = document.getElementById("search-username");
    nameEl.innerHTML = this.user.firstName;
  }

  // function to show user profile
  showUserProfile() {
    const profileEl = document.getElementById("user-profile");
    profileEl.classList.remove("d-none");
  }

  // function to show user intro
  showUserIntro() {
    const introEl = document.getElementById("intro");
    introEl.classList.remove("d-none");
  }

  // function to hide user profile loader
  hideUserProfileLoader() {
    const profileLoaderEl = document.getElementById("user-profile-placeholder");
    profileLoaderEl.classList.add("d-none");
  }

  // function to hide intro loader
  hideIntroLoader() {
    const introLoaderEl = document.getElementById("intro-placeholder");
    introLoaderEl.classList.add("d-none");
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

  // function to show say something
  showSaySomething() {
    const saySomethingEl = document.getElementById("say-something");
    saySomethingEl.classList.remove("d-none");
  }

  // function to hide say something loader
  hideSaySomethingPlaceholder() {
    const saySomethingPlaceholderEL = document.getElementById("say-something-placeholder");
    saySomethingPlaceholderEL.classList.add("d-none");
  }

  // function to remove say something element
  removeSaySomethingElement() {
    const saySomethingEl = document.getElementById("say-something-container");
    saySomethingEl.parentElement.removeChild(saySomethingEl);
  }

  showError(text) {
    const errorEl = document.getElementById("error");
    // errorEl.innerHTML = text;
    // errorEl.classList.remove("d-none");
  }

  // function to set user profile information
  async setUserProfile() {
    try {
      // gets single user based on user id
      const response = await UserClass.getSingleUser(parseInt(this.userIdParams));

      if (response.error) {
        throw new Error(response.error);
      }

      this.user = response;

      this.setProfileImage(); // setting user profile image
      this.setProfileFullName(); // setting user profile fullname
      this.setProfileUsername(); // setting user profile username
      this.hideUserProfileLoader(); // hiding user profile loader
      this.showUserProfile(); // showing user profile

      return {};
    } catch (error) {
      return { error: error.message };
    }
  }

  // setting posts of user
  async setUserPosts() {
    try {
      // getting posts based on user id
      const response = await Post.getUserPosts(this.user.id, this.limit, this.skip);

      if (response.error) {
        throw new Error(response.error);
      }

      const { posts, total } = response;

      if (total === 0) {
        throw new Error("no posts found.");
      }

      // setting last post id for showing more posts
      Profile.setLastPostId(posts[posts.length - 1].id);
      this.total = total;

      for (const post of posts) {
        // getting all comments for each post
        const response = await CommentClass.getPostComments(post.id);

        if (response.error) {
          throw new Error(response.error);
        }

        // creates a new Post object
        const postObj = new Post(post, this.user, response.comments);
        postObj.createNewPost(); // creates new post and appends it to the posts element
      }

      return {};
    } catch (error) {
      return { error: error.message };
    }
  }

  // function to add scroll event listener for getting more posts
  addScrollEventListener() {
    document.body.addEventListener("scroll", Profile.handleScrollEventListener);
  }

  // function to handle scroll event listener
  static handleScrollEventListener() {
    const postEl = document.getElementById(`post-${Profile.#lastPostId}`);
    if (postEl) {
      // creates a custom event.
      // this custom event is handled in profile.js
      const customEvent = new Event("handleNewPosts");

      // function to check if element is in viewport
      function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return rect.top < 0;
      }

      // checks if last post is in view
      if (isInViewport(postEl)) {
        document.dispatchEvent(customEvent);
        document.body.removeEventListener("scroll", Profile.handleScrollEventListener);
      }
    }
  }
}

export default Profile;

import userClass from "./User.class.js";
import Post from "./Post.class.js";
import commentClass from "./Comment.class.js";

class Newsfeed {
  constructor() {
    this.user;
  }

  setUser() {
    this.user = userClass.getUser();
  }

  setUserData() {
    this.#setUserImage("side-profile-user-image");
    this.#setText("side-profile-username", `${this.user.firstName} ${this.user.lastName}`);
    this.#setText("side-username", `${this.user.username}`);
    this.#setText("firstName", `${this.user.firstName}`);
    this.#setText("company", `${this.user.company.name}`);
    this.#setText("position", `${this.user.company.title}`);

    this.#setUserImage("search-image");
    this.#setText("search-username", this.user.firstName);
  }

  #setUserImage(userImageElId) {
    const imageEl = document.getElementById(userImageElId);
    imageEl.setAttribute("src", this.user.image);
    imageEl.setAttribute("alt", this.user.username);
  }

  #setText(elementId, text) {
    const element = document.getElementById(elementId);
    element.innerHTML = text;
  }

  async setAllPosts() {
    try {
      const response = await Post.getAllPosts();

      if (response.error) {
        throw new Error(response.error);
      }

      const { posts } = response;

      for (const post of posts) {
        // add errors
        const user = await userClass.getSingleUser(post.userId);
        const response = await commentClass.getPostComments(post.id);

        const postObj = new Post(post, user, response.comments);
        postObj.createNewPost();
      }

      return {};
    } catch (error) {
      return { error: error.message };
    }
  }

  handleNewsfeedLoaders() {
    const leftSidebarEl = document.getElementById("left-side");
    const leftSidebarPlaceholderEl = document.getElementById("left-side-placeholder");
    const saySomethingEl = document.getElementById("say-something");
    const saySomethingPlaceholderEL = document.getElementById("say-something-placeholder");

    saySomethingPlaceholderEL.classList.add("d-none");
    leftSidebarPlaceholderEl.classList.add("d-none");
    leftSidebarEl.classList.remove("d-none");
    saySomethingEl.classList.remove("d-none");
  }

  addSidePostProfileEventListener() {
    const imageEl = document.getElementById("side-profile-user-image");
    imageEl.addEventListener("click", () => {
      window.location.href = `/html/profile.html?id=${this.user.id}`;
    });
  }

  addScrollEventListener() {
    document.body.addEventListener("scroll", Newsfeed.handleScrollEventListener);
  }

  static handleScrollEventListener() {
    const postEl = document.getElementById(`post-${Post.getLastPostId()}`);
    const customEvent = new Event("handleNewPosts");

    // function to check if element is in viewport
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return rect.top < 0;
    }

    if (isInViewport(postEl)) {
      document.dispatchEvent(customEvent);
      document.body.removeEventListener("scroll", Newsfeed.handleScrollEventListener);
    }
  }
}

export default new Newsfeed();

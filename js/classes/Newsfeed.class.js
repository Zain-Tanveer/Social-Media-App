import userClass from "./User.class.js";
import postClass from "./Post.class.js";
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
    this.#setUsername("side-profile-username", `${this.user.firstName} ${this.user.lastName}`);

    this.#setUserImage("search-image");
    this.#setUsername("search-username", this.user.firstName);
  }

  #setUserImage(userImageElId) {
    const imageEl = document.getElementById(userImageElId);
    imageEl.setAttribute("src", this.user.image);
    imageEl.setAttribute("alt", this.user.username);
  }

  #setUsername(usernameElId, text) {
    const nameEl = document.getElementById(usernameElId);
    nameEl.innerHTML = text;
  }

  async setAllPosts() {
    try {
      const { posts } = await postClass.getAllPosts();

      for (const post of posts) {
        const user = await userClass.getSingleUser(post.userId);
        const comments = await commentClass.getPostComments(post.id);
        await postClass.createNewPost(post, user, comments.comments);
      }
    } catch (error) {
      console.log(error);
    }
  }

  addScrollEventListener() {
    document.body.addEventListener("scroll", Newsfeed.handleScrollEventListener);
  }

  static handleScrollEventListener() {
    const postEl = document.getElementById(`post-${postClass.getLastPostId()}`);
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

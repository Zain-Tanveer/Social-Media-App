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
    const postEl = document.getElementById(`post-${postClass.getLastPostId()}`);

    document.getElementById("posts").addEventListener("scroll", () => {
      console.log("event listener added");
      if (this.isInViewport(postEl)) {
        console.log("in view");
      }
    });
  }

  // function to check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}

export default new Newsfeed();

import userClass, { User } from "./User.class.js";
import Post from "./Post.class.js";
import commentClass from "./Comment.class.js";

class Newsfeed {
  constructor() {
    this.user;
    this.posts;
    this.users = [];
  }

  // function to set posts value
  setPosts(posts) {
    this.posts = posts;
  }

  // function to get posts value
  getPosts() {
    return this.posts;
  }

  setUser() {
    this.user = userClass.getUser();
  }

  setUserData() {
    this.#setUserImage("side-profile-user-image", this.user);
    this.#setText("side-profile-username", `${this.user.firstName} ${this.user.lastName}`);
    this.#setText("side-username", `${this.user.username}`);
    this.#setText("firstName", `${this.user.firstName}`);
    this.#setText("company", `${this.user.company.name}`);
    this.#setText("position", `${this.user.company.title}`);

    this.#setUserImage("search-image", this.user);
    this.#setText("search-username", this.user.firstName);
  }

  #setUserImage(userImageElId, user) {
    const imageEl = document.getElementById(userImageElId);
    imageEl.setAttribute("src", user.image);
    imageEl.setAttribute("alt", user.username);
  }

  #setText(elementId, text) {
    const element = document.getElementById(elementId);
    element.innerHTML = text;
  }

  setNotifications() {
    const notificationsEl = document.querySelector("#notifications .card");
    const notifyEl = notificationsEl.querySelector(".notification");

    notifyEl.parentElement.removeChild(notifyEl);
    console.log(this.users);

    for (const post of this.posts.reverse()) {
      const user = this.users.find((usr) => usr.id === post.userId);

      const newNotifyEl = notifyEl.cloneNode(true);
      this.#setNotifyElement(newNotifyEl, post, user);

      notificationsEl.appendChild(newNotifyEl);
    }

    this.hideNotificationsLoader();
    this.showNotifications();
  }

  #setNotifyElement(notifyEl, post, user) {
    this.#setNotifyTitle(notifyEl, post);
    this.#setNotifyImage(notifyEl, user);
    this.#setNotifyUsername(notifyEl, user);
  }

  #setNotifyImage(notifyEl, user) {
    const imageEl = notifyEl.querySelector(".notify-image");
    imageEl.setAttribute("src", user.image);
    imageEl.setAttribute("alt", user.username);
  }

  #setNotifyTitle(notifyEl, post) {
    const titleEl = notifyEl.querySelector(".notifications-title");
    titleEl.innerHTML = post.title;
  }

  #setNotifyUsername(notifyEl, user) {
    const usernameEl = notifyEl.querySelector(".notifications-username");
    usernameEl.innerHTML = user.username;
  }

  async setAllPosts() {
    try {
      const response = await Post.getAllPosts();

      if (response.error) {
        throw new Error(response.error);
      }

      const { posts } = response;
      this.posts = posts;

      for (const post of posts) {
        // add errors
        const user = await userClass.getSingleUser(post.userId);
        const response = await commentClass.getPostComments(post.id);

        this.users.push(user);

        const postObj = new Post(post, user, response.comments);
        postObj.createNewPost();
      }

      return {};
    } catch (error) {
      return { error: error.message };
    }
  }

  async setPeopleMayKnowUsers() {
    try {
      const response = await User.getUsers();

      if (response.error) {
        throw new Error(response.error);
      }

      const { users } = response;

      console.log(response);

      const peopleMayKnowEl = document.querySelector("#people-you-may-know .card");
      const peopleUserEl = peopleMayKnowEl.querySelector(".people-may-know-user");

      peopleUserEl.parentElement.removeChild(peopleUserEl);

      for (const user of users) {
        const newUserEl = this.createPeopleUserElement(user, peopleUserEl);

        peopleMayKnowEl.appendChild(newUserEl);
      }

      this.hidePeopleYouMayKnowLoader();
      this.showPeopleYouMayKnow();

      return {};
    } catch (error) {
      console.log(error);
      return { error: error.message };
    }
  }

  hideUserSideProfileLoader() {
    const sideProfileLoaderEl = document.getElementById("side-profile-placeholder");
    sideProfileLoaderEl.classList.add("d-none");
  }

  showUserSideProfile() {
    const sideProfileEl = document.getElementById("user-side-profile");
    sideProfileEl.classList.remove("d-none");
  }

  hideSaySomethingLoader() {
    const saySomethingPlaceholderEL = document.getElementById("say-something-placeholder");
    saySomethingPlaceholderEL.classList.add("d-none");
  }

  showSaySomethingElement() {
    const saySomethingEl = document.getElementById("say-something");
    saySomethingEl.classList.remove("d-none");
  }

  hidePeopleYouMayKnowLoader() {
    const loaderEl = document.getElementById("people-you-may-know-placeholder");
    loaderEl.classList.add("d-none");
  }

  showPeopleYouMayKnow() {
    const peopleMayKnowEl = document.getElementById("people-you-may-know");
    peopleMayKnowEl.classList.remove("d-none");
  }

  showNotifications() {
    const notificationsEl = document.getElementById("notifications");
    notificationsEl.classList.remove("d-none");
  }

  hideNotificationsLoader() {
    const notificationsEl = document.getElementById("notifications-placeholder");
    notificationsEl.classList.add("d-none");
  }

  createPeopleUserElement(user, peopleUserEl) {
    const newUserEl = peopleUserEl.cloneNode(true);

    this.#setPeopleUserImage(newUserEl, user);
    this.#setPeopleUserFullname(newUserEl, user);
    this.#setPeopleUserUsername(newUserEl, user);
    this.#addPeopleUserEventListener(newUserEl, user);

    return newUserEl;
  }

  #setPeopleUserImage(userEl, user) {
    const imageEl = userEl.querySelector(".may-know-image");
    imageEl.setAttribute("src", user.image);
    imageEl.setAttribute("alt", user.username);
  }

  #setPeopleUserFullname(userEl, user) {
    const usernameEl = userEl.querySelector(".may-know-fullname");
    usernameEl.innerHTML = `${user.firstName} ${user.lastName}`;
  }

  #setPeopleUserUsername(userEl, user) {
    const usernameEl = userEl.querySelector(".may-know-username");
    usernameEl.innerHTML = user.username;
  }

  #addPeopleUserEventListener(userEl, user) {
    userEl.addEventListener("click", () => {
      window.open(`/html/profile.html?id=${user.id}`, "_blank");
    });
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

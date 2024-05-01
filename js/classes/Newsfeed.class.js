import userClass, { User } from "./User.class.js";
import Post from "./Post.class.js";
import commentClass from "./Comment.class.js";

class Newsfeed {
  constructor() {
    this.user;
    this.posts; // used for notifications
    this.users = []; // used for notifications
  }

  // function to set posts value
  setPosts(posts) {
    this.posts = posts;
  }

  // function to get posts value
  getPosts() {
    return this.posts;
  }

  // function to set user
  setUser() {
    this.user = userClass.getUser();
  }

  // function to set side profile user data
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

  // function to set user image on image element
  #setUserImage(userImageElId, user) {
    const imageEl = document.getElementById(userImageElId);
    imageEl.setAttribute("src", user.image);
    imageEl.setAttribute("alt", user.username);
  }

  // function to set text of an element
  #setText(elementId, text) {
    const element = document.getElementById(elementId);
    element.innerHTML = text;
  }

  // function to set notifications.
  // since there is no api for notifications I used the posts fetched
  // to display notifications.
  setNotifications() {
    const notificationsEl = document.querySelector("#notifications .card");
    const notifyEl = notificationsEl.querySelector(".notification");

    notifyEl.parentElement.removeChild(notifyEl); // removing the hardcoded html element

    for (const post of this.posts.reverse()) {
      const user = this.users.find((usr) => usr.id === post.userId); // finding user for specific post

      const newNotifyEl = notifyEl.cloneNode(true); // cloning the notification html element
      this.#setNotifyElement(newNotifyEl, post, user); // setting the information for new notification element

      notificationsEl.appendChild(newNotifyEl);
    }

    this.hideNotificationsLoader(); // hiding the notifications loader
    this.showNotifications(); // showing the notifications
  }

  // function to set each notification in notifications
  #setNotifyElement(notifyEl, post, user) {
    this.#setNotifyTitle(notifyEl, post);
    this.#setNotifyImage(notifyEl, user);
    this.#setNotifyUsername(notifyEl, user);
  }

  // function to set image on notification element
  #setNotifyImage(notifyEl, user) {
    const imageEl = notifyEl.querySelector(".notify-image");
    imageEl.setAttribute("src", user.image);
    imageEl.setAttribute("alt", user.username);
  }

  // function to set title on notification element
  #setNotifyTitle(notifyEl, post) {
    const titleEl = notifyEl.querySelector(".notifications-title");
    titleEl.innerHTML = post.title;
  }

  // function to set username on notification element
  #setNotifyUsername(notifyEl, user) {
    const usernameEl = notifyEl.querySelector(".notifications-username");
    usernameEl.innerHTML = user.username;
  }

  // function to set all posts on newsfeed page
  async setAllPosts() {
    try {
      const response = await Post.getAllPosts(); // getting 10 posts

      if (response.error) {
        throw new Error(response.error);
      }

      const { posts } = response;
      this.posts = posts;

      for (const post of posts) {
        // add errors
        const user = await userClass.getSingleUser(post.userId);
        if (user.error) {
          throw new Error(user.error);
        }
        this.users.push(user);

        const response = await commentClass.getPostComments(post.id);
        if (response.error) {
          throw new Error(response.error);
        }

        const postObj = new Post(post, user, response.comments);
        postObj.createNewPost(); // creating a new post
      }

      return {};
    } catch (error) {
      return { error: error.message };
    }
  }

  // function for setting the users for people you may know section
  async setPeopleMayKnowUsers() {
    try {
      const response = await User.getUsers(); // getting 10 users

      if (response.error) {
        throw new Error(response.error);
      }

      const { users } = response;

      const peopleMayKnowEl = document.querySelector("#people-you-may-know .card");
      const peopleUserEl = peopleMayKnowEl.querySelector(".people-may-know-user");

      peopleUserEl.parentElement.removeChild(peopleUserEl); // removing the hardcoded html element

      for (const user of users) {
        const newUserEl = this.createPeopleUserElement(user, peopleUserEl); // creating a new element

        peopleMayKnowEl.appendChild(newUserEl); // appending the new element to people you may know section
      }

      this.hidePeopleYouMayKnowLoader();
      this.showPeopleYouMayKnow();

      return {};
    } catch (error) {
      console.log(error);
      return { error: error.message };
    }
  }

  // function to hide the side profile loader
  hideUserSideProfileLoader() {
    const sideProfileLoaderEl = document.getElementById("side-profile-placeholder");
    sideProfileLoaderEl.classList.add("d-none");
  }

  // function to show the side profile
  showUserSideProfile() {
    const sideProfileEl = document.getElementById("user-side-profile");
    sideProfileEl.classList.remove("d-none");
  }

  // function to hide say something loader
  hideSaySomethingLoader() {
    const saySomethingPlaceholderEL = document.getElementById("say-something-placeholder");
    saySomethingPlaceholderEL.classList.add("d-none");
  }

  // function to show say something element
  showSaySomethingElement() {
    const saySomethingEl = document.getElementById("say-something");
    saySomethingEl.classList.remove("d-none");
  }

  // function to hide people you may know loader
  hidePeopleYouMayKnowLoader() {
    const loaderEl = document.getElementById("people-you-may-know-placeholder");
    loaderEl.classList.add("d-none");
  }

  // function to show people you may know
  showPeopleYouMayKnow() {
    const peopleMayKnowEl = document.getElementById("people-you-may-know");
    peopleMayKnowEl.classList.remove("d-none");
  }

  // function to show notifications
  showNotifications() {
    const notificationsEl = document.getElementById("notifications");
    notificationsEl.classList.remove("d-none");
  }

  // function to hide notifications loader
  hideNotificationsLoader() {
    const notificationsEl = document.getElementById("notifications-placeholder");
    notificationsEl.classList.add("d-none");
  }

  // function to create a new user element for people you may know section
  createPeopleUserElement(user, peopleUserEl) {
    const newUserEl = peopleUserEl.cloneNode(true);

    this.#setPeopleUserImage(newUserEl, user);
    this.#setPeopleUserFullname(newUserEl, user);
    this.#setPeopleUserUsername(newUserEl, user);
    this.#addPeopleUserEventListener(newUserEl, user);

    return newUserEl;
  }

  // function to set the image in people you may know user
  #setPeopleUserImage(userEl, user) {
    const imageEl = userEl.querySelector(".may-know-image");
    imageEl.setAttribute("src", user.image);
    imageEl.setAttribute("alt", user.username);
  }

  // function to set the fullname in people you may know user
  #setPeopleUserFullname(userEl, user) {
    const usernameEl = userEl.querySelector(".may-know-fullname");
    usernameEl.innerHTML = `${user.firstName} ${user.lastName}`;
  }

  // function to set the username in people you may know user
  #setPeopleUserUsername(userEl, user) {
    const usernameEl = userEl.querySelector(".may-know-username");
    usernameEl.innerHTML = user.username;
  }

  // function to add event listener on click of people you may know user
  #addPeopleUserEventListener(userEl, user) {
    userEl.addEventListener("click", () => {
      window.open(`../html/profile.html?id=${user.id}`, "_blank");
    });
  }

  // function to add event listener on click of user image in side profile section
  addSidePostProfileEventListener() {
    const imageEl = document.getElementById("side-profile-user-image");
    imageEl.addEventListener("click", () => {
      window.location.href = `../html/profile.html?id=${this.user.id}`;
    });
  }

  // function to add scroll event listener for getting more posts
  addScrollEventListener() {
    document.body.addEventListener("scroll", Newsfeed.handleScrollEventListener);
  }

  // function to handle scroll event listener
  static handleScrollEventListener() {
    const postEl = document.getElementById(`post-${Post.getLastPostId()}`);
    // creates a custom event.
    // this custom event is handled in newsfeed.js
    const customEvent = new Event("handleNewPosts");

    // function to check if element is in viewport
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return rect.top < 0;
    }

    // checks if last post is in view
    if (isInViewport(postEl)) {
      document.dispatchEvent(customEvent);
      document.body.removeEventListener("scroll", Newsfeed.handleScrollEventListener);
    }
  }
}

export default new Newsfeed();

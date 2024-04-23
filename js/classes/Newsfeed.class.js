import userClass from "./User.class.js";

class Newsfeed {
  constructor() {
    this.user;
  }

  setUser() {
    this.user = userClass.getUser();
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

  setUserData() {
    this.#setUserImage("side-profile-user-image");
    this.#setUsername("side-profile-username", `${this.user.firstName} ${this.user.lastName}`);

    this.#setUserImage("search-image");
    this.#setUsername("search-username", this.user.firstName);
  }
}

export default new Newsfeed();

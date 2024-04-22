import userClass from "./User.class.js";

class Authenticate {
  constructor() {}

  async isAuthenticated() {
    try {
      const token = userClass.getToken();
      const response = await userClass.getAuthenticatedUser(token);

      if (response.error) {
        // window.location.href = `../index.html?error=Unauthorized! Please log in.`;
      } else {
        document.querySelector(".main-content").style.display = "initial";
      }
    } catch (error) {
      console.log("auth error:", error);
    }
  }
}

export default new Authenticate();

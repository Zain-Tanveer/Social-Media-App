import userClass from "./User.class.js";

class Authenticate {
  constructor() {}

  // function to authenticate a user.
  // if authentication failed then redirect user to login page
  async isAuthenticated() {
    try {
      const token = userClass.getToken();

      if (!token) {
        throw new Error("401");
      }

      const response = await userClass.getAuthenticatedUser(token);

      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      if (error.message === "401") {
        window.location.href = `../index.html?error=Unauthorized! Please login.`;
      }
    }
  }
}

export default new Authenticate();

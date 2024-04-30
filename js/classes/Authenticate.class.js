import userClass from "./User.class.js";

class Authenticate {
  constructor() {}

  async isAuthenticated() {
    try {
      const token = userClass.getToken();

      if (!token) {
        throw new Error("Unauthorized! Please login.");
      }

      const response = await userClass.getAuthenticatedUser(token);

      if (response.error && response.error === "401") {
        window.location.href = `../index.html?error=${error.message}`;
      } else if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default new Authenticate();

import userClass from "./User.class.js";

class Authenticate {
  constructor() {}

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

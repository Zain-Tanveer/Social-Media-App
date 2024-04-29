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

      console.log(response);

      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      // window.location.href = `../index.html?error=Unauthorized! Please log in.`;
    }
  }
}

export default new Authenticate();

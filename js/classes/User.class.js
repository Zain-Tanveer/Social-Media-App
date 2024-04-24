class User {
  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  setToken(token) {
    localStorage.setItem("token", token);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  async getSingleUser(userId) {
    try {
      const response = await fetch(`https://dummyjson.com/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return { error: error.message };
    }
  }

  async LoginUser(username, password) {
    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 10080, // 1 week
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setToken(data.token);
      return data;
    } catch (error) {
      return { error: error.message };
    }
  }

  async getAuthenticatedUser(token) {
    try {
      const response = await fetch("https://dummyjson.com/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      this.setUser(data);
      return data;
    } catch (error) {
      console.log(error);
      return { error: error.message };
    }
  }
}

export default new User();
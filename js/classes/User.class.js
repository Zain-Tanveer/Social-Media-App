class User {
  // function to save the user data in local storage.
  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  // function to get the user data from local storage
  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  // function to set the token in local storage.
  // this is done after user successfully logs in.
  // the token is fetched from the dummyjson login user api.
  setToken(token) {
    localStorage.setItem("token", token);
  }

  // function to get the token from local storage
  getToken() {
    return localStorage.getItem("token");
  }

  // function to get 8 users.
  // this function is called in Newsfeed.class.js to get
  // users for people you may know section
  static async getUsers() {
    try {
      const response = await fetch(
        `https://dummyjson.com/users?limit=8&skip=0&select=firstName,lastName,username,image`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return { error: error.message };
    }
  }

  // function to get users based on a specific text.
  // this function is called in Header.class.js for when
  // user tries to search for something using the search input
  // field.
  static async getSearchUsers(search) {
    try {
      const response = await fetch(
        `https://dummyjson.com/users/search?q=${search}&limit=3&select=firstName,lastName,username,image`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return { error: error.message };
    }
  }

  // function to get a single user by passing the user id
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

  // function to login the user
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

      // setting the token in local storage after successful api response
      this.setToken(data.token);
      return data;
    } catch (error) {
      return { error: error.message };
    }
  }

  // function to authenticate the logged in user.
  // this function is called at the top of every .js file
  // except login.js
  async getAuthenticatedUser(token) {
    try {
      const response = await fetch("https://dummyjson.com/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(response.status);
      }

      const data = await response.json();
      this.setUser(data);
      return data;
    } catch (error) {
      return { error: error.message };
    }
  }

  // function to log out the user and clear local storage
  logoutUser() {
    localStorage.clear();
    window.location.href = "../index.html";
  }
}

export { User };

export default new User();

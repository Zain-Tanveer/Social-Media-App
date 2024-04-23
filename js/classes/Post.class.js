class Post {
  constructor() {}

  async getAllPosts(limit = 10, skip = 0) {
    try {
      const response = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("something went wrong");
      }

      return data;
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default new Post();

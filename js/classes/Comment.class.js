class Comment {
  constructor() {}

  async getPostComments(post_id) {
    try {
      const response = await fetch(`https://dummyjson.com/comments/post/${post_id}`);
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

export default new Comment();

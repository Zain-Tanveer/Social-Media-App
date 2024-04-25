class Comment {
  constructor() {}

  async getPostComments(post_id) {
    try {
      const response = await fetch(`https://dummyjson.com/comments/post/${post_id}`);

      if (!response.ok) {
        throw new Error("something went wrong");
      }

      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  async addComment(body, userId, postId) {
    try {
      const response = await fetch("https://dummyjson.com/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body,
          postId,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error adding comment. Please try again.");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default new Comment();

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
          body: "This makes all sense to me!",
          postId: 32323,
          userId: 5,
        }),
      });

      if (!response.ok) {
        throw new Error("Error adding comment. Please try again.");
      }

      const data = await response.json();

      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return { error: error.message };
    }
  }
}

export default new Comment();

class Comment {
  constructor() {}

  // function to get comments of specific posts
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

  // function to add a comment
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

  // function to update a comment
  async updateComment(body, commentId) {
    try {
      const response = await fetch(`https://dummyjson.com/comments/${commentId}`, {
        method: "PUT" /* or PATCH */,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body,
        }),
      });

      if (!response.ok) {
        throw new Error("Error updating comment. Please try again.");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      return { error: error.message };
    }
  }

  // function to delete a comment
  async deleteComment(commentId = 1) {
    try {
      const response = await fetch(`https://dummyjson.com/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error deleting comment. Please try again.");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default new Comment();

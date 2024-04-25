class Modal {
  constructor() {}

  static addDeleteModalEventListener() {
    const modalCommentDeleteBtn = document.getElementById("modal-comment-delete-button");
    modalCommentDeleteBtn.addEventListener("click", () => {
      const commentId = modalCommentDeleteBtn.dataset.id;

      const commentEl = document.querySelector(
        `.comment-container[data-comment-id="${commentId}"]`
      );
      const customEvent = new Event(`deleteComment${commentId}`);
      document.dispatchEvent(customEvent);

      commentEl.parentNode.removeChild(commentEl);
    });
  }
}

export default Modal;

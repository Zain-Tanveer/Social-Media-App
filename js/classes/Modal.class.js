class Modal {
  static #deleteModal = new bootstrap.Modal("#deleteCommentModal");

  constructor() {}

  static showDeleteCommentModal() {
    Modal.#deleteModal.show();
  }

  static hideDeleteCommentModal() {
    Modal.#deleteModal.hide();
  }

  static addDeleteModalEventListener() {
    const modalCommentDeleteBtn = document.getElementById("modal-comment-delete-button");
    modalCommentDeleteBtn.addEventListener("click", () => {
      const commentId = modalCommentDeleteBtn.dataset.id;

      const customEvent = new Event(`deleteComment${commentId}`);
      document.dispatchEvent(customEvent);
    });
  }
}

export default Modal;

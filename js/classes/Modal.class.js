class Modal {
  static #deleteModal = new bootstrap.Modal("#deleteCommentModal");

  constructor() {}

  // function to show delete modal
  static showDeleteCommentModal() {
    Modal.#deleteModal.show();
  }

  // function to hide delete modal
  static hideDeleteCommentModal() {
    Modal.#deleteModal.hide();
  }

  // function to add event listener on click of delete modal
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

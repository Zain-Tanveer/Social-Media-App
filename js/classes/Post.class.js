import userClass from "./User.class.js";

class Post {
  // this is the post that is hardcoded in html.
  // we create other posts by cloning this post and then
  // replacing values where necessary.
  static #initialPostEl = document.getElementById("static-post");

  static #limit = 10;
  static #skip = 0;
  static #lastPostId;

  constructor(post, user, comments) {
    this.postEl;
    this.post = post;
    this.user = user;
    this.comments = comments;
    this.comment_id = 1000;
  }

  // function to set the current post element
  setPostElement(postEl) {
    this.postEl = postEl;
  }

  // function to get the current post element
  getPostElement() {
    return this.postEl;
  }

  // function to set initial post
  static setInitialPostEl(postEl) {
    Post.#initialPostEl = postEl;
  }

  // function to get static post
  static getInitialPostEl() {
    return Post.#initialPostEl;
  }

  // function to set skip value
  static setSkip(skip) {
    Post.#skip = skip;
  }

  // function to get skip value
  static getSkip() {
    return Post.#skip;
  }

  // function to set the id for last post.
  static setLastPostId(id) {
    Post.#lastPostId = id;
  }

  // function to get id for last post
  static getLastPostId() {
    return Post.#lastPostId;
  }

  // function to get all posts data from api
  static async getAllPosts(skip = Post.#skip, limit = Post.#limit) {
    try {
      const response = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("something went wrong");
      }

      Post.setLastPostId(data.posts[data.posts.length - 1].id);

      return data;
    } catch (error) {
      return { error: error.message };
    }
  }

  // function to create a new post
  createNewPost() {
    const newPostEl = Post.getInitialPostEl().cloneNode(true);
    newPostEl.classList.remove("d-none");
    this.setPostElement(newPostEl);

    this.setPostData(this.postEl);
    this.addPostEventListeners(this.postEl);

    document.getElementById("posts").appendChild(this.getPostElement());
  }

  // function to set the data of a post
  setPostData(postEl) {
    this.setPostIds(postEl); // setting all ids on post
    this.setPostImages(postEl); // setting all images on post
    this.setPostUserInfo(postEl); // setting all user information related to the post
    this.setPostTitle(postEl); // setting the title of post
    this.setPostBody(postEl); // setting the body of post
    this.setPostReactions(postEl); // setting the likes count
    this.setPostComments(postEl); // setting the comment of post
    this.setUserInfo(postEl); // setting the logged in user info on post
  }

  // function to set post modal data
  setModalPostData() {
    const postModalEl = document.getElementById("postModal");

    this.setPostModalTitle(postModalEl); // setting the title on post modal
    this.setPostImages(postModalEl); // setting all images on post modal
    this.setPostUserInfo(postModalEl); // setting all user information related to the post modal
    this.setPostTitle(postModalEl); // setting the title of post modal
    this.setPostBody(postModalEl); // setting the body of post modal
    this.setPostReactions(postModalEl); // setting the likes count
    this.setPostCommentNumber(postModalEl); // setting the comments count
    this.setPostCommentNumberText(postModalEl); // setting the 'comment/comments' text
    this.setModalPostComments(postModalEl); // setting the comment of post
    this.setUserInfo(postModalEl); // setting the logged in user info on post

    this.addCommentInputEventListener(postModalEl);
  }

  setPostModalTitle(modalEl) {
    const modalTitleEl = modalEl.querySelector("#postModalLabel");
    modalTitleEl.innerHTML = `${this.user.username}'s post`;
  }

  // function to set all ids of post
  setPostIds(postEl) {
    postEl.setAttribute("id", `post-${this.post.id}`);
  }

  // function to set all images of post
  setPostImages(postEl) {
    const imageEl = postEl.querySelector(".user-image-post");
    imageEl.setAttribute("src", this.user.image);
    imageEl.setAttribute("alt", this.user.username);

    const randomNumber = Math.floor(Math.random() * 20) + 1;
    const postImageEl = postEl.querySelector(".post-image img");
    postImageEl.setAttribute("src", `../assets/images/posts/post-${randomNumber}.jpg`);
  }

  // function to set all user info related to the post
  setPostUserInfo(postEl) {
    const fullnameEl = postEl.querySelector(".fullname-post");
    fullnameEl.innerHTML = `${this.user.firstName} ${this.user.lastName}`;

    const usernameEl = postEl.querySelector(".username-post");
    usernameEl.innerHTML = this.user.username;
  }

  // function to set the current logged in user info on the post i.e., in the comment input
  setUserInfo(postEl) {
    const user = userClass.getUser();

    const imageEl = postEl.querySelector(".post-comment-user-image");
    imageEl.setAttribute("src", user.image);
    imageEl.setAttribute("alt", user.username);

    const inputEl = postEl.querySelector(".comment-input");
    inputEl.setAttribute("placeholder", `Comment as ${user.username}`);
  }

  // function to set post title
  setPostTitle(postEl) {
    const titleEl = postEl.querySelector(".post-title");
    titleEl.innerHTML = this.post.title;
  }

  // function to set the body of post
  setPostBody(postEl) {
    if (this.post.body.length > 120) {
      const firstHalf = this.post.body.slice(0, 100);
      const secondHalf = this.post.body.slice(100);

      const firstBodyEl = postEl.querySelector(".post-body-first");
      firstBodyEl.innerHTML = firstHalf;

      const postBodyShowEl = postEl.querySelector(".post-body-show-button");
      postBodyShowEl.setAttribute("href", `#postBodyCollapse${this.post.id}`);
      postBodyShowEl.setAttribute("aria-controls", `postBodyCollapse${this.post.id}`);
      postBodyShowEl.innerHTML = "show more";

      const postBodyCollapseEl = postEl.querySelector(".post-body-collapse");
      postBodyCollapseEl.setAttribute("id", `postBodyCollapse${this.post.id}`);
      postBodyCollapseEl.innerHTML = secondHalf;

      postBodyCollapseEl.appendChild(this.createPostBodyTags(this.post.tags));
    } else {
      const postBodyEl = postEl.querySelector(".post-body");
      postBodyEl.innerHTML = this.post.body;
      postBodyEl.appendChild(this.createPostBodyTags(this.post.tags));
    }
  }

  // function to set the reactions of post
  setPostReactions(postEl) {
    if (this.post.reactions <= 0) {
      const likesCommentsNumbersEl = postEl.querySelector(".likes-comments-numbers");
      const likesIconEl = likesCommentsNumbersEl.querySelector(".likes-icon-span");
      if (likesIconEl) {
        likesCommentsNumbersEl.removeChild(likesIconEl);
      }
    } else {
      const likesNumberEl = postEl.querySelector(".likes-number");
      likesNumberEl.innerHTML = this.post.reactions;
    }
  }

  // function to set the comments of post
  setPostComments(postEl) {
    const commentEl = postEl.querySelector(".comment-container");

    if (this.comments.length > 0) {
      const loggedUser = userClass.getUser();

      this.setPostCommentInfo(postEl, this.comments[0]);
      this.setPostCommentNumber(postEl);

      const commentsNumberEl = postEl.querySelector(".comments-number");

      if (this.comments[0].user.id === loggedUser.id) {
        commentEl.setAttribute("data-comment-id", `${this.post.id}-${this.comments[0].id}`);
        this.setCommentOptionsDropdown(postEl, commentEl, "user", this.comments[0].id);
      } else {
        this.setCommentOptionsDropdown(postEl, commentEl, "other");
      }

      if (this.comments.length > 1) {
        const moreCommentsEl = postEl.querySelector(".more-comments");
        commentsNumberEl.innerHTML += " comments";
        moreCommentsEl.innerHTML = "view more comments";
      } else {
        commentsNumberEl.innerHTML += " comment";
      }
    } else {
      commentEl.style.display = "none";
    }
  }

  // function to set info of comment on post
  setPostCommentInfo(postEl, comment) {
    const commentUserEl = postEl.querySelector(".comment-user");
    const commentBodyEl = postEl.querySelector(".comment-body");
    commentUserEl.innerHTML = comment.user.username;
    commentBodyEl.innerHTML = comment.body;
  }

  // function to set comments number on post
  setPostCommentNumber(postEl) {
    const commentsNumberEl = postEl.querySelector(".comments-number");
    commentsNumberEl.innerHTML = this.comments.length;
  }

  // function to set the comments of post modal
  setModalPostComments(postEl) {
    const commentsWrapperEl = postEl.querySelector(".comments-wrapper");
    const commentEl = commentsWrapperEl.querySelector(".comment-container");

    commentsWrapperEl.innerHTML = "";

    const loggedUser = userClass.getUser();

    for (const comment of this.comments) {
      const newCommentEl = this.cloneElement(commentEl);
      this.setPostCommentInfo(newCommentEl, comment);

      if (comment.user && comment.user.id === loggedUser.id) {
        newCommentEl.setAttribute("data-comment-id", `${this.post.id}-${comment.id}`);
        this.setCommentOptionsDropdown(postEl, newCommentEl, "user", comment.id);
      } else {
        this.setCommentOptionsDropdown(postEl, newCommentEl, "other");
      }

      commentsWrapperEl.appendChild(newCommentEl);
    }
  }

  // function to set comments number text on post modal
  setPostCommentNumberText(postEl) {
    const commentsNumberEl = postEl.querySelector(".comments-number");

    if (this.comments.length > 1) {
      commentsNumberEl.innerHTML += " comments";
    } else {
      commentsNumberEl.innerHTML += " comment";
    }
  }

  // function to set comment dropdown options
  setCommentOptionsDropdown(postEl, commentEl, type = "other", comment_id = null) {
    const commentDropdownEl = commentEl.querySelector(".comment-options-dropdown");
    commentDropdownEl.innerHTML = "";

    this.createDropdownElements(postEl, commentDropdownEl, type, comment_id);
  }

  // function to create dropdown elements
  createDropdownElements(postEl, dropdownEl, type, comment_id) {
    if (type === "user") {
      const editEl = this.createDropdownLiEl("edit");
      this.addDropdownEditEventListener(postEl, editEl, comment_id);
      dropdownEl.appendChild(editEl);

      const deleteEl = this.createDropdownLiEl("delete");
      deleteEl.setAttribute("data-bs-toggle", "modal");
      deleteEl.setAttribute("data-bs-target", "#deleteCommentModal");
      this.addDropdownDeleteEventListener(postEl, deleteEl, `${this.post.id}-${comment_id}`);
      dropdownEl.appendChild(deleteEl);
    } else {
      dropdownEl.appendChild(this.createDropdownLiEl("hide comment"));
      dropdownEl.appendChild(this.createDropdownLiEl("show comment"));
    }
  }

  // function to create dropdown li element
  createDropdownLiEl(text) {
    const liEl = document.createElement("li");
    liEl.appendChild(this.createDropdownAnchorEl(text));

    return liEl;
  }

  // function to create dropdown anchor element
  createDropdownAnchorEl(text) {
    const anchorEl = document.createElement("a");
    anchorEl.classList.add("fs-300", "dropdown-item", "fw-bold");
    anchorEl.innerHTML = text;

    return anchorEl;
  }

  // function to clone a element
  cloneElement(element) {
    return element.cloneNode(true);
  }

  // function to create hashtags for post body
  createPostBodyTags(tags) {
    const tagsDiv = document.createElement("div");
    tagsDiv.classList.add("mt-1");

    tags.forEach((tag) => {
      const spanEl = document.createElement("span");
      spanEl.classList.add("clr-primary");
      spanEl.classList.add("me-1");
      spanEl.innerHTML = `#${tag}`;
      tagsDiv.appendChild(spanEl);
    });

    return tagsDiv;
  }

  // function to add event listeners on post
  addPostEventListeners(postEl) {
    this.addMoreCommentsEventListener(postEl);
    this.addCommentInputEventListener(postEl);
  }

  // function to add event listener for more view more comments on post
  addMoreCommentsEventListener(postEl) {
    const moreCommentsEl = postEl.querySelector(".more-comments");

    moreCommentsEl.addEventListener("click", () => {
      this.setModalPostData();
    });
  }

  // function to add event listener for comment input field
  addCommentInputEventListener(postEl) {
    const inputEl = postEl.querySelector(".comment-input");

    inputEl.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        if (inputEl.value !== "") {
          const loggedUser = userClass.getUser();

          const commentsWrapperEl = postEl.querySelector(".comments-wrapper");
          const commentEl = commentsWrapperEl.querySelector(".comment-container");

          const newComment = {
            id: this.comment_id,
            body: inputEl.value,
            user: {
              id: loggedUser.id,
              username: loggedUser.username,
            },
          };

          this.comments.push(newComment);

          const newCommentEl = this.cloneElement(commentEl);
          newCommentEl.style.display = "initial";
          newCommentEl.setAttribute("data-comment-id", `${this.post.id}-${this.comment_id}`);

          this.setPostCommentInfo(newCommentEl, newComment);
          this.setPostCommentNumber(postEl);
          this.setPostCommentNumberText(postEl);

          if (postEl.getAttribute("id") === "postModal") {
            this.setPostCommentNumber(this.postEl);
            this.setPostCommentNumberText(this.postEl);

            const postCommentWrapperEl = this.postEl.querySelector(".comments-wrapper");
            const clonedNewCommentEl = this.cloneElement(newCommentEl);
            this.setCommentOptionsDropdown(
              this.postEl,
              clonedNewCommentEl,
              "user",
              this.comment_id
            );
            postCommentWrapperEl.appendChild(clonedNewCommentEl);
          }

          this.setCommentOptionsDropdown(postEl, newCommentEl, "user", this.comment_id);

          commentsWrapperEl.appendChild(newCommentEl);

          inputEl.value = "";
          this.comment_id++;
        }
      }
    });
  }

  // function to add event listener on edit button in comment dropdown
  addDropdownEditEventListener(postEl, element, comment_id) {
    element.addEventListener("click", () => {
      console.log(element);
      console.log("comments", this.comments);
      console.log("comment id", comment_id);
    });
  }

  // function to add event listener on delete button in comment dropdown
  addDropdownDeleteEventListener(postEl, element, data_id) {
    element.addEventListener("click", () => {
      const modalCommentDeleteBtn = document.getElementById("modal-comment-delete-button");
      modalCommentDeleteBtn.setAttribute("data-id", data_id);

      document.addEventListener(`deleteComment${data_id}`, () => {
        const comments = Post.handleDeleteEventListener(this.comments, data_id);
        this.comments = comments;
        this.setPostCommentNumber(postEl);
        this.setPostCommentNumberText(postEl);

        if (postEl.getAttribute("id") === "postModal") {
          this.setPostCommentNumber(this.postEl);
          this.setPostCommentNumberText(this.postEl);
        }
      });
    });
  }

  // function to handle custom delete event listener dispatched
  // from 'addDeleteModalEventListener' in Modal class
  static handleDeleteEventListener(comments, data_id) {
    const commentId = parseInt(data_id.split("-")[1]);
    return comments.filter((comment) => comment.id !== commentId);
  }
}

export default Post;

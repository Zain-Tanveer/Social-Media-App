import userClass from "./User.class.js";

class Post {
  constructor() {
    // this is the post that is hardcoded in html.
    // we create other posts by cloning this post and then
    // replacing values where necessary.
    this.staticPostEl = document.getElementById("static-post");
    // this will remove that hardcoded post in html.
    document.getElementById("posts").innerHTML = "";

    this.limit = 10;
    this.skip = 0;

    // this is to handle getting more posts once
    // the user scrolls down.
    this.lastPostId;
  }

  // function to set static post
  setStaticPostEl(postEl) {
    this.staticPostEl = postEl;
  }

  // function to get static post
  getStaticPostEl() {
    return this.staticPostEl;
  }

  // function to set skip value
  setSkip(skip) {
    this.skip = skip;
  }

  // function to get skip value
  getSkip() {
    return this.skip;
  }

  // function to set the id for last post.
  setLastPostId(id) {
    this.lastPostId = id;
  }

  // function to get id for last post
  getLastPostId() {
    return this.lastPostId;
  }

  // function to get all posts data from api
  async getAllPosts(skip = this.skip, limit = this.limit) {
    try {
      const response = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("something went wrong");
      }

      this.setLastPostId(data.posts[data.posts.length - 1].id);
      console.log(data);

      return data;
    } catch (error) {
      return { error: error.message };
    }
  }

  // function to create a new post
  createNewPost(post, user, comments) {
    let newPostEl = this.staticPostEl.cloneNode(true);
    newPostEl = this.setPostData(newPostEl, post, user, comments);
    this.addPostEventListeners(newPostEl, post, user, comments);

    document.getElementById("posts").appendChild(newPostEl);
  }

  // function to set the data of a post
  setPostData(postEl, post, user, comments) {
    this.setPostIds(postEl, post); // setting all ids on post
    this.setPostImages(postEl, user); // setting all images on post
    this.setPostUserInfo(postEl, user); // setting all user information related to the post
    this.setPostTitle(postEl, post); // setting the title of post
    this.setPostBody(postEl, post); // setting the body of post
    this.setPostReactions(postEl, post); // setting the likes count
    this.setPostComments(postEl, comments, post); // setting the comment of post
    this.setUserInfo(postEl); // setting the logged in user info on post

    return postEl;
  }

  // function to set post modal data
  setModalPostData(post, user, comments) {
    const postModalEl = document.getElementById("postModal");

    this.setPostModalTitle(postModalEl, user); // setting the title on post modal
    this.setPostImages(postModalEl, user); // setting all images on post modal
    this.setPostUserInfo(postModalEl, user); // setting all user information related to the post modal
    this.setPostTitle(postModalEl, post); // setting the title of post modal
    this.setPostBody(postModalEl, post); // setting the body of post modal
    this.setPostReactions(postModalEl, post); // setting the likes count
    this.setPostCommentNumber(postModalEl, comments.length); // setting the comments count
    this.setModalPostCommentNumberText(postModalEl, comments); // setting the 'comment/comments' text
    this.setModalPostComments(postModalEl, comments); // setting the comment of post
    this.setUserInfo(postModalEl); // setting the logged in user info on post
  }

  setPostModalTitle(modalEl, user) {
    const modalTitleEl = modalEl.querySelector("#postModalLabel");
    modalTitleEl.innerHTML = `${user.username}'s post`;
  }

  // function to set all ids of post
  setPostIds(postEl, post) {
    postEl.setAttribute("id", `post-${post.id}`);
  }

  // function to set all images of post
  setPostImages(postEl, user) {
    const imageEl = postEl.querySelector(".user-image-post");
    imageEl.setAttribute("src", user.image);
    imageEl.setAttribute("alt", user.username);

    const randomNumber = Math.floor(Math.random() * 20) + 1;
    const postImageEl = postEl.querySelector(".post-image img");
    postImageEl.setAttribute("src", `../assets/images/posts/post-${randomNumber}.jpg`);
  }

  // function to set all user info related to the post
  setPostUserInfo(postEl, user) {
    const fullnameEl = postEl.querySelector(".fullname-post");
    fullnameEl.innerHTML = `${user.firstName} ${user.lastName}`;

    const usernameEl = postEl.querySelector(".username-post");
    usernameEl.innerHTML = user.username;
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
  setPostTitle(postEl, post) {
    const titleEl = postEl.querySelector(".post-title");
    titleEl.innerHTML = post.title;
  }

  // function to set the body of post
  setPostBody(postEl, post) {
    if (post.body.length > 120) {
      const firstHalf = post.body.slice(0, 100);
      const secondHalf = post.body.slice(100);

      const firstBodyEl = postEl.querySelector(".post-body-first");
      firstBodyEl.innerHTML = firstHalf;

      const postBodyShowEl = postEl.querySelector(".post-body-show-button");
      postBodyShowEl.setAttribute("href", `#postBodyCollapse${post.id}`);
      postBodyShowEl.setAttribute("aria-controls", `postBodyCollapse${post.id}`);
      postBodyShowEl.innerHTML = "show more";

      const postBodyCollapseEl = postEl.querySelector(".post-body-collapse");
      postBodyCollapseEl.setAttribute("id", `postBodyCollapse${post.id}`);
      postBodyCollapseEl.innerHTML = secondHalf;

      postBodyCollapseEl.appendChild(this.createPostBodyTags(post.tags));
    } else {
      const postBodyEl = postEl.querySelector(".post-body");
      postBodyEl.innerHTML = post.body;
      postBodyEl.appendChild(this.createPostBodyTags(post.tags));
    }
  }

  // function to set the reactions of post
  setPostReactions(postEl, post) {
    if (post.reactions <= 0) {
      const likesCommentsNumbersEl = postEl.querySelector(".likes-comments-numbers");
      const likesIconEl = likesCommentsNumbersEl.querySelector(".likes-icon-span");
      likesCommentsNumbersEl.removeChild(likesIconEl);
    } else {
      const likesNumberEl = postEl.querySelector(".likes-number");
      likesNumberEl.innerHTML = post.reactions;
    }
  }

  // function to set the comments of post
  setPostComments(postEl, comments) {
    if (comments.length > 0) {
      this.setPostCommentInfo(postEl, comments[0]);
      this.setPostCommentNumber(postEl, comments.length);

      const commentsNumberEl = postEl.querySelector(".comments-number");

      if (comments.length > 1) {
        const moreCommentsEl = postEl.querySelector(".more-comments");
        commentsNumberEl.innerHTML += " comments";
        moreCommentsEl.innerHTML = "view more comments";
      } else {
        commentsNumberEl.innerHTML += " comment";
      }
    } else {
      const commentsEl = postEl.querySelector(".comments");
      commentsEl.style.display = "none";
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
  setPostCommentNumber(postEl, text) {
    const commentsNumberEl = postEl.querySelector(".comments-number");
    commentsNumberEl.innerHTML = text;
  }

  // function to set the comments of post modal
  setModalPostComments(postEl, comments) {
    const commentsWrapperEl = postEl.querySelector(".comments-wrapper");
    const commentEl = commentsWrapperEl.querySelector(".comment-container");

    commentsWrapperEl.innerHTML = "";

    for (const comment of comments) {
      const newCommentEl = this.createModalPostComment(commentEl);
      this.setPostCommentInfo(newCommentEl, comment);
      commentsWrapperEl.appendChild(newCommentEl);
    }
  }

  // function to set comments number text on post modal
  setModalPostCommentNumberText(postEl, comments) {
    const commentsNumberEl = postEl.querySelector(".comments-number");

    if (comments.length > 1) {
      commentsNumberEl.innerHTML += " comments";
    } else {
      commentsNumberEl.innerHTML += " comment";
    }
  }

  // function to create comment of post modal
  createModalPostComment(commentEl) {
    return commentEl.cloneNode(true);
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
  addPostEventListeners(postEl, post, user, comments) {
    this.addMoreCommentsEventListener(postEl, post, user, comments);
  }

  // function to add event listener for more view more comments on post
  addMoreCommentsEventListener(postEl, post, user, comments) {
    const moreCommentsEl = postEl.querySelector(".more-comments");

    moreCommentsEl.addEventListener("click", () => {
      this.setModalPostData(post, user, comments);
    });
  }
}

export default new Post();

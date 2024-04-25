import authenticate from "./classes/Authenticate.class.js";
import newsfeedClass from "./classes/Newsfeed.class.js";
import Post from "./classes/Post.class.js";
import Modal from "./classes/Modal.class.js";

// Modal.showDeleteCommentModal();

// this will remove that hardcoded post in html.
document.getElementById("posts").innerHTML = "";

await authenticate.isAuthenticated();

// initialize all tooltips for bootstrap
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
[...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

newsfeedClass.setUser(); // setting logged in user info for class usage
newsfeedClass.setUserData(); // setting user data in side profile

const leftSidebarEl = document.getElementById("left-side");
const leftSidebarPlaceholderEl = document.getElementById("left-side-placeholder");
const saySomethingEl = document.getElementById("say-something");
const saySomethingPlaceholderEL = document.getElementById("say-something-placeholder");

saySomethingPlaceholderEL.classList.add("d-none");
leftSidebarPlaceholderEl.classList.add("d-none");
leftSidebarEl.classList.remove("d-none");
saySomethingEl.classList.remove("d-none");

await newsfeedClass.setAllPosts(); // setting posts data
newsfeedClass.addScrollEventListener(); // setting scroll event listener for getting more posts

Modal.addDeleteModalEventListener();

// this is a custom event. it is triggered every time when the last
// post is on screen. see 'addScrollEventListener()' in newsfeed class.
document.addEventListener("handleNewPosts", async () => {
  Post.setSkip(Post.getSkip() + 10); // updating the skip value to get next 10 posts
  await newsfeedClass.setAllPosts(); // getting the next 10 posts
  newsfeedClass.addScrollEventListener(); // setting scroll event listener for getting more posts
});

console.log("after posts");

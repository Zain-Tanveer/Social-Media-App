import authenticate from "./classes/Authenticate.class.js";
import newsfeedClass from "./classes/Newsfeed.class.js";
import postClass from "./classes/Post.class.js";

await authenticate.isAuthenticated();

// initialize all tooltips for bootstrap
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
[...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

newsfeedClass.setUser();
newsfeedClass.setUserData();

console.log(newsfeedClass.user);

const posts = await postClass.getAllPosts();
console.log(posts);

console.log("posts after");

// window.addEventListener("scroll", () => {
//   console.log("scroll");
// });

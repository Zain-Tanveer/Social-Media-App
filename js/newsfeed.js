import authenticate from "./classes/Authenticate.class.js";
import newsfeedClass from "./classes/Newsfeed.class.js";

await authenticate.isAuthenticated();

// initialize all tooltips for bootstrap
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
[...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

newsfeedClass.setUser(); // setting logged in user info for class usage
newsfeedClass.setUserData(); // setting user data in side profile
await newsfeedClass.setAllPosts(); // setting posts data
newsfeedClass.addScrollEventListener(); // setting scroll event listener for getting more posts

window.addEventListener("scroll", () => {
  console.log("scroll");
});

console.log("after posts");

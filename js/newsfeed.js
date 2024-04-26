import authenticate from "./classes/Authenticate.class.js";
import newsfeedClass from "./classes/Newsfeed.class.js";
import Post from "./classes/Post.class.js";
import Modal from "./classes/Modal.class.js";

// Modal.showDeleteCommentModal();

// this will remove that hardcoded post in html.
document.getElementById("posts").innerHTML = "";

// authenticates user. if failed will redirect
await authenticate.isAuthenticated();

newsfeedClass.setUser(); // setting logged in user info for class usage
newsfeedClass.setUserData(); // setting user data in side profile

newsfeedClass.handleNewsfeedLoaders(); // will set the styling of loaders i.e., d-none to display data

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

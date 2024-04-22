import authenticate from "./classes/Authenticate.class.js";
import userClass from "./classes/User.class.js";

await authenticate.isAuthenticated();
const user = userClass.getUser();

// initialize all tooltips for bootstrap
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

console.log(user);

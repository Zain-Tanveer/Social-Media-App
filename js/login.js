("use strict");

import userClass from "./classes/User.class.js";
import utility from "./classes/Utility.class.js";

// remove query parameters from the URL on page reload.
// when the user tries to access any other page without logging in
// he is redirected back to login page with error message as query
// parameters and error is displayed.
// this ensures that on page reload the error is not displayed again.
if (performance.getEntriesByType("navigation")[0].type === "reload") {
  const url = window.location.href.split("?")[0];
  window.history.replaceState({}, document.title, url);
}
const queryParams = new URLSearchParams(window.location.search);
for (const [key, value] of queryParams) {
  if (key === "error") {
    utility.displayAlertMessage(value, "danger", 2000);
  }
}

// variables
const formEl = document.getElementById("login-form");

// event listeners
formEl.addEventListener(
  "submit",
  async (e) => {
    e.preventDefault();

    // needed for bootstrap validation
    if (!formEl.checkValidity()) {
      e.stopPropagation();
      formEl.classList.add("was-validated");
      return;
    }

    const username = formEl.querySelector("#username").value;
    const password = formEl.querySelector("#password").value;

    const submitButtonEl = document.querySelector(".login-submit");
    const submitText = submitButtonEl.querySelector(" .submit-text");
    const submitLoader = submitButtonEl.querySelector(".login-button-loader");

    // disables submit button and shows loader while api call is being made
    submitButtonEl.disabled = true;
    submitText.classList.add("d-none");
    submitLoader.classList.remove("d-none");

    // makes the api call to dummyjson login user api
    const response = await userClass.LoginUser(username, password);

    // enables submit button and hides loader after api call response
    submitButtonEl.disabled = false;
    submitText.classList.remove("d-none");
    submitLoader.classList.add("d-none");

    if (response.error) {
      utility.displayAlertMessage(response.error, "danger");
    } else {
      utility.displayAlertMessage("Login successful!", "success", 2000);
      setTimeout(() => {
        window.location.href = "html/newsfeed.html";
      }, 2000);
    }
  },
  false
);

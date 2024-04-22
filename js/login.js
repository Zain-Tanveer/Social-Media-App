("use strict");

import userClass from "./classes/User.class.js";
import utility from "./classes/Utility.class.js";

// Remove query parameters from the URL on page reload
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

const formEl = document.getElementById("login-form");

formEl.addEventListener(
  "submit",
  async (e) => {
    e.preventDefault();

    if (!formEl.checkValidity()) {
      e.stopPropagation();
      formEl.classList.add("was-validated");
      return;
    }

    const username = formEl.querySelector("#username").value;
    const password = formEl.querySelector("#password").value;

    const response = await userClass.LoginUser(username, password);

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

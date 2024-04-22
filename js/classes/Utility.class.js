class Utility {
  constructor() {
    this.intervalId;
  }

  displayAlertMessage(message, type, duration = 3500) {
    const messageEl = document.getElementById("response-message");
    const textEl = messageEl.querySelector("#response-text");
    const progressBarEl = messageEl.querySelector("#progressBar");
    const svgEl = messageEl.querySelector("#response-svg");
    const svgElImg = svgEl.querySelector("use");

    if (messageEl.classList.contains("alert-success")) {
      messageEl.classList.remove("alert-success");
      progressBarEl.classList.remove("bg-success");
      svgEl.removeAttribute("aria-label", `success:`);
      svgElImg.removeAttribute("href", `#success-fill`);
    } else if (messageEl.classList.contains("alert-danger")) {
      messageEl.classList.remove("alert-danger");
      progressBarEl.classList.remove("bg-danger");
      svgEl.removeAttribute("aria-label", `danger:`);
      svgElImg.removeAttribute("href", `#danger-fill`);
    }

    progressBarEl.style.width = "0%";
    progressBarEl.classList.add(`bg-${type}`);
    messageEl.classList.add(`alert-${type}`);
    messageEl.classList.remove("d-none");
    svgEl.setAttribute("aria-label", `${type}:`);
    svgElImg.setAttribute("href", `#${type}-fill`);

    textEl.innerHTML = message;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    const startTime = new Date().getTime();

    this.intervalId = setInterval(frame, 10);
    function frame() {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;
      const progress = (elapsedTime / duration) * 100;

      if (progress >= 100) {
        messageEl.classList.add("d-none");
        progressBarEl.classList.remove(`bg-${type}`);
        messageEl.classList.remove(`alert-${type}`);
        clearInterval(this.intervalId);
      } else {
        progressBarEl.style.width = progress + "%";
      }
    }
  }
}

export default new Utility();

function cleanupAlertContainers() {
  const successContainer = document.querySelector(".success-container");
  const errorContainer = document.querySelector(".error-container");
  successContainer.classList.add("hidden");
  successContainer.classList.remove("flex");
  errorContainer.classList.add("hidden");
  errorContainer.classList.remove("flex");
}


document.addEventListener("DOMContentLoaded", () => {
  const profileUpdateBtn = document.querySelector("#profile-update-btn");
  const successContainer = document.querySelector(".success-container");
  const errorContainer = document.querySelector(".error-container");

  profileUpdateBtn.addEventListener("click", async (e) => {
    e.preventDefault();  

    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
      const response = await fetch("/u/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const responseData = await response.json();
      cleanupAlertContainers();

      if (response.ok) {
        successContainer.classList.remove("hidden");
        successContainer.classList.add("flex");
        successContainer.childNodes[0].textContent = responseData.message;
      } else {
        errorContainer.classList.remove("hidden");
        errorContainer.classList.add("flex");
        errorContainer.childNodes[0].textContent = responseData.message;
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  });

  const closeBtns = document.querySelectorAll(".close-btn");
  closeBtns.forEach((closeBtn) => {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      cleanupAlertContainers();
    });
  });
});


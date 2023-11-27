function showModal() {
    const modal = document.getElementById('popup-modal');
    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

function hideModal() {
    const modal = document.getElementById('popup-modal');
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

document.addEventListener("DOMContentLoaded", function () {
    const deleteButtons = document.querySelectorAll(".delete-blog-btn");
    const confirmBtn = document.getElementById("confirm-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const popupModal = document.getElementById("popup-modal");
    let currentDeleteId = null;

    deleteButtons.forEach((button) => {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        currentDeleteId = event.target.dataset.blogId;
        showModal();
      });
    });

    confirmBtn.addEventListener("click", function () {
      if (currentDeleteId) {
        hideModal();
        document.querySelector(`#delete-form-${currentDeleteId}`).submit();
      }
    });

    cancelBtn.addEventListener("click", function () {
        hideModal();
        currentDeleteId = null;
    });

    // Close the modal when clicking outside of it
    window.addEventListener("click", function (event) {
      if (event.target === popupModal) {
        hideModal();
        currentDeleteId = null;
      }
    });

    // Close the modal when pressing the escape key
    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        hideModal();
        currentDeleteId = null;
      }
    });
  });
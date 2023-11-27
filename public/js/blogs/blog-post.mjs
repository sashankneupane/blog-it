
// utility functions
function adjustTextareaHeight(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function enableCommentBox(commentBox) {
  commentBox.readOnly = false;
  commentBox.focus();
  const length = commentBox.value.length;
  commentBox.setSelectionRange(length, length);
}

function disableCommentBox(commentBox) {
  commentBox.readOnly = true;
}

function showModal(modal) {
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function hideModal(modal) {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

let blogId, likeBtn, likeCount, likeIcon;
let modal, confirmButton, cancelButton, closeButton;
let commentBox, commentBtn;
let commentBtns, editBtns, updateBtns, deleteBtns;
;

function init() {
  blogId = window.location.href.split("/").pop();

  likeBtn = document.querySelector("#like-btn");
  likeCount = document.querySelector("#like-count");
  likeIcon = document.querySelector("#like-btn svg");

  modal = document.getElementById("popup-modal");
  confirmButton = document.getElementById("confirm-btn");
  cancelButton = document.getElementById("cancel-btn");
  closeButton = document.getElementById("close-btn");

  commentBox = document.querySelector("#comment-box");
  commentBtn = document.querySelector("#comment-btn");

  commentBtns = document.querySelectorAll(".edit-delete-btn-container");
  editBtns = document.querySelectorAll(".edit-btn");
  updateBtns = document.querySelectorAll(".update-btn");
  deleteBtns = document.querySelectorAll(".delete-btn");

  const publishedDateContainer = document.querySelector(
    "#published-date",
  );
  const updatedDateContainer = document.querySelector(
    "#updated-date"
  );

  publishedDate = publishedDateContainer.dataset.publishedDate
  updatedDate = updatedDateContainer.dataset.updatedDate;

  if (publishedDate === updatedDate) {
      publishedDateContainer.classList.remove("hidden");
  } else {
      updatedDateContainer.classList.remove("hidden");;
  }

  // adjust textarea height
  commentBoxes = document.querySelectorAll(".comment-box");
  commentBoxes.forEach((commentBox) => {
    adjustTextareaHeight(commentBox);
  });
  const mainCommentBox = document.querySelector("#comment-box");
  mainCommentBox.addEventListener("input", () => {
    adjustTextareaHeight(mainCommentBox);
  });
}

// Event handlers
function handleLikeBtnClick(e) {
  e.preventDefault();

  fetch(`/blog/${blogId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        likeCount.textContent = data.numberOfLikes;

        if (data.liked) {
          likeIcon.classList.add("fill-red");
          likeIcon.classList.remove("fill-none");
        } else {
          likeIcon.classList.remove("fill-red");
          likeIcon.classList.add("fill-none");
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function handleCommmentBtnClick(e) {
  e.preventDefault();

  fetch(`/blog/${blogId}/comment/write`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: commentBox.value }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function handleCommentEditBtnClick(e) {
  e.preventDefault();

  const commentId = e.currentTarget.id.split("-")[2];
  const updateBtn = document.querySelector(`#update-btn-${commentId}`);
  const commentBox = document.querySelector(`#comment-box-${commentId}`);

  commentBox.addEventListener("input", () => {
    adjustTextareaHeight(commentBox);
  });

  e.currentTarget.classList.toggle("hidden");
  updateBtn.classList.toggle("hidden");

  enableCommentBox(commentBox);
}

function handleCommentUpdateBtnClick(e) {
  e.preventDefault();

  const commentId = e.currentTarget.id.split("-")[2];
  const commentBox = document.querySelector(`#comment-box-${commentId}`);

  fetch(`/blog/${blogId}/comment/${commentId}/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: commentBox.value }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        disableCommentBox(commentBox);
        document
          .querySelector(`#edit-btn-${commentId}`)
          .classList.toggle("hidden");
        document
          .querySelector(`#update-btn-${commentId}`)
          .classList.toggle("hidden");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function handleCommentDeleteBtnClick(e) {
  e.preventDefault();

  const commentId = e.currentTarget.id.split("-")[2];

  showModal(modal);

  confirmButton.addEventListener("click", async () => {
    hideModal(modal);
    try {
      const res = await fetch(`/blog/${blogId}/comment/${commentId}/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
  cancelButton.addEventListener("click", () => {
    hideModal(modal);
  });
  closeButton.addEventListener("click", () => {
    hideModal(modal);
  });
}

// on dom loaded
function handleDOMLoaded() {
  init();
  // show edit/delete btn if current user is the author of the comment
  if (commentBtns) {
    commentBtns.forEach((btn) => {
      if (btn.dataset.currentUser === btn.dataset.commentAuthor) {
        btn.querySelector(".edit-btn").classList.toggle("hidden");
        btn.querySelector(".delete-btn").classList.toggle("hidden");
      }
    });
  }

  // all event listeners
  likeBtn.addEventListener("click", handleLikeBtnClick);
  if (commentBtn) {
    commentBtn.addEventListener("click", handleCommmentBtnClick);
  }
  editBtns.forEach((btn) => {
    btn.addEventListener("click", handleCommentEditBtnClick);
  });
  updateBtns.forEach((btn) => {
    btn.addEventListener("click", handleCommentUpdateBtnClick);
  });
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", handleCommentDeleteBtnClick);
  });
}

document.addEventListener("DOMContentLoaded", handleDOMLoaded);
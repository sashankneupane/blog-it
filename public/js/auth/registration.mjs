function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.classList.add("overflow-hidden");
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");
}

// DOM elements
let modalShowElements, modalHideElements;
let registrationForm;

function init() {
    modalShowElements = document.querySelectorAll("[data-modal-show]");
    modalHideElements = document.querySelectorAll("[data-modal-hide]");
    registrationForm = document.getElementById("registration-form");
}

function handleModalShowClick(e) {
    e.stopPropagation();
    const modalId = e.target.getAttribute("data-modal-show");
    showModal(modalId);
}

function handleModalHideClick(e) {
    e.stopPropagation();
    const modalId = e.target.getAttribute("data-modal-hide");
    hideModal(modalId);
}

function validateEmail(email) {
    // Use a regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleRegistrationFormSubmit(e) {
    e.preventDefault();

    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");

    if (username.value.trim() === "") {
        alert("Username cannot be empty");
        return;
    }

    if (password.value.length < 8) {
        alert("Password must be at least 8 characters long");
        return;
    }

    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match");
        return;
    }

    if (!validateEmail(email.value)) {
        alert("Invalid email address");
        return;
    }

    fetch("/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username.value,
            email: email.value,
            password: password.value,
        }),
    }).then((res) => {
        console.log(res)
        if (res.status !== 200) {
            res.json().then((data) => {
                alert(data.message);
            });
        } else {
            window.location.href = "/home";
        }}) 
        .catch((err) => {
            console.error("Error registering user:", err);
            alert("Internal server error");
        });
}

// event handlers
function handleDOMLoaded() {
    init();
    modalShowElements.forEach(function (element) {
        element.addEventListener("click", handleModalShowClick);
    });
    modalHideElements.forEach(function (element) {
        element.addEventListener("click", handleModalHideClick);
    });
    registrationForm.addEventListener("submit", handleRegistrationFormSubmit);
}

// event listeners
document.addEventListener("DOMContentLoaded", handleDOMLoaded);
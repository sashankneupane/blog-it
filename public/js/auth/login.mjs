function handleCloseBtnClick(e) {
    e.preventDefault();
    const errorContainer = document.getElementById("error-container");
    errorContainer.classList.add("hidden");
}

function handleDOMLoaded() {
    const closeBtn = document.getElementById("close-btn");
    if (closeBtn) {
        closeBtn.addEventListener("click", handleCloseBtnClick);
    }
}

document.addEventListener("DOMContentLoaded", handleDOMLoaded);
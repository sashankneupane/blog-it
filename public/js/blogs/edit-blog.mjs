let tags = [];


function createTagElement(tag) {

    const tagElement = document.createElement("div");
    tagElement.classList.add("tag", "mr-2", "px-2", "py-1", "rounded-md", "border-red-200", "bg-red-200", "text-sm");
  
    // Tag text
    const tagText = document.createElement("span");
    tagText.textContent = tag;
  
    // Close button
    const closeButton = document.createElement("button");
    closeButton.classList.add("text-gray-600", "hover:text-gray-800", "focus:outline-none", "px-2", "ml-2");
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", function (e) {
        e.preventDefault();
        tags.splice(tags.indexOf(tag), 1);
        updateTags();
    });
  
    // Append tag text and close button to the tag element
    tagElement.appendChild(tagText);
    tagElement.appendChild(closeButton);
  
    return tagElement;
  }

function updateTags() {
    const tagContainer = document.querySelector("#tag-container");

    if (tags.length === 0) {
        tagContainer.classList.remove("flex");
        tagContainer.classList.add("hidden");
        return;
    }

    tagContainer.classList.remove("hidden");
    tagContainer.classList.add("flex");

    tagContainer.innerHTML = "";

    tags.forEach((tag) => {
        tagContainer.appendChild(createTagElement(tag));
    });
}

function adjustTextareaHeight(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}

function initializeTags() {
    const tagInput = document.querySelector("#tags");
    tags = tagInput.value.split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");
    tagInput.value = "";
    updateTags();
}

function handleTagInput() {
    const tagInput = document.querySelector("#tags");
    let value = tagInput.value;
    const lastchar = value.slice(-1);
    
    if (lastchar === "," || lastchar === " " || lastchar === "\n") {
        tagInput.value = "";
        value = value.slice(0, -1).trim();
        if (value.length === 0 || tags.includes(value)) {
            return;
        }
        tags.push(value);
    }
    updateTags();
}


function handleBlogFormSubmit(e) {
    e.preventDefault();
    const tagInput = document.querySelector("#tags");
    const value = tagInput.value.trim();
    if (value.length > 0 && !tags.includes(value)) {
        tags.push(value);
    }
    tagInput.value = tags.join(",");
    e.target.submit();
}

function handleDOMLoaded() {
    const textarea = document.querySelector("#content");
    const blogForm = document.querySelector("#edit-blog-form");
    
    // Adjust height initially if content is already present
    adjustTextareaHeight(textarea);
    textarea.addEventListener("input", function () {
      adjustTextareaHeight(textarea);
    });

    const tagInput = document.querySelector("#tags");
    initializeTags();

    tagInput.addEventListener("input", handleTagInput);
    blogForm.addEventListener("submit", handleBlogFormSubmit);
}

document.addEventListener("DOMContentLoaded", handleDOMLoaded);
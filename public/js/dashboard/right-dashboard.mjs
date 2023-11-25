function cleanupAlertContainers() {
    const successContainer = document.querySelector('.success-container');
    const errorContainer = document.querySelector('.error-container');
    successContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
}

function closeAlert(alertContainer) {
    alertContainer.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    const profileUpdateBtn = document.querySelector('#profile-update-btn');
    const successContainer = document.querySelector('.success-container');
    const errorContainer = document.querySelector('.error-container');

    const successCloseBtn = successContainer.querySelector('.close-btn');
    const errorCloseBtn = errorContainer.querySelector('.close-btn');


    profileUpdateBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Update profile button clicked');

        const username = document.querySelector('#username').value;
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        try {
            const response = await fetch('/u/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username, name, email, password
                })
            });

            const responseData = await response.json();
            cleanupAlertContainers();

            if (response.ok) {
                successContainer.classList.remove('hidden');
                // const successMessage = successContainer.querySelector('.message');
                // successMessage.textContent = responseData.message;
                // successCloseBtn.classList.add('flex')
                // successCloseBtn.classList.remove('hidden');
                successContainer.textContent = responseData.message;
            } else {
                errorContainer.classList.remove('hidden');
                errorContainer.textContent = responseData.message;
                // const errorMessage = errorContainer.querySelector('.message');
                // errorMessage.textContent = responseData.message;
                // errorCloseBtn.classList.add('flex')
                // errorCloseBtn.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    });

    successCloseBtn.addEventListener('click', () => {
        closeAlert(successContainer);
    });

    errorCloseBtn.addEventListener('click', () => {
        closeAlert(errorContainer);
    });
});
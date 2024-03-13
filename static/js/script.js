let loggedIn = false; // Initially, the user is not logged in

function openLoginModal() {
    // Show login modal
    document.getElementById('id01').style.display = 'block';
}

function openSignupModal() {
    // Show signup modal
    document.getElementById('id02').style.display = 'block';
}

function login() {
    const uname = document.getElementById('uname').value;
    const psw = document.getElementById('psw').value;
    
}


    // Make an AJAX request to the server for login
    fetch('/ajax_login_validation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `uname=${encodeURIComponent(uname)}&psw=${encodeURIComponent(psw)}`,
    })
    .then(response => response.json())
    .then(data => {
        if (data.validationSuccess && data.loggedIn) {
            loggedIn = true;
            closeModal('id01');
            // Update UI or redirect as needed
        } else {
            // Handle login failure, show error message, etc.
            console.error('Login failed:', data.message);
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
    });


    function signup() {
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('psw').value;
        const passwordRepeat = document.getElementById('psw-repeat').value;
    
        // Make an AJAX request to the server for signup
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&password-repeat=${encodeURIComponent(passwordRepeat)}`,
        })
        .then(response => response.json())
        .then(data => {
            if (data.validationSuccess && data.loggedIn) {
                loggedIn = true;
                closeModal('id02');
                // Update UI or redirect as needed
            } else {
                // Handle signup failure, show error message, etc.
                console.error('Signup failed:', data.message);
            }
        })
        .catch(error => {
            console.error('Error during signup:', error);
        });
    }
    
function closeModal(modalId) {
    // Hide the specified modal
    document.getElementById(modalId).style.display = 'none';
}
// JavaScript for cancel button click event
document.addEventListener("DOMContentLoaded", function() {
    let cancelIcons = document.querySelectorAll('.cancel-icon');
    cancelIcons.forEach(function(icon) {
        icon.addEventListener('click', function() {
            icon.parentElement.style.display = 'none';
        });
    });
});


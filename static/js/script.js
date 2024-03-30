let loggedIn = false; // Initially, the user is not logged in

function openLoginModal() {
    // Show login modal
    document.getElementById('id01').style.display = 'block';
}

function openSignupModal() {
    // Show signup modal
    document.getElementById('id02').style.display = 'block';
}
function openSearchModal() {
    // Show search modal
    document.getElementById('id03').style.display = 'block';}

function openContactModal() {
        // Show contact modal
        document.getElementById('id04').style.display = 'block';

    }
    function openTestimonialsModal() {
        const modalContent = `
            <div id="testimonialsModalContent" class="modal-content animate">
                <span class="close" onclick="closeModal('ido5')">&times;</span>
                <div>
                    <button onclick="openAddTestimonialModal()" style="width: 500px;">Add Testimonial</button>
                    <button onclick="openExistingTestimonialsModal()" style="width: 500px;">View Existing Testimonials</button>
                </div>
            </div>
        `;
        
        // Replace the content of ido5 modal with modalContent
        document.getElementById('ido5').innerHTML = modalContent;
        
        // Show the ido5 modal
        document.getElementById('ido5').style.display = 'block';
    }
    
    function openAddTestimonialModal() {
        // Hide the existing modal content
        document.getElementById('testimonialsModalContent').style.display = 'none';
    
        // Show the Add Testimonial modal
        document.getElementById('addTestimonialModal').style.display = 'block';
    }
    
    
function submitTestimonial() {
        const username = document.getElementById('username').value;
        const testimonial = document.getElementById('testimonial').value;

        // Simulate submission (replace with actual submission code)
        const success = Math.random() < 0.5; // Simulating random success/failure

        if (success) {
            document.getElementById('submissionStatus').innerText = 'Testimonial submitted successfully!';
            document.getElementById('testimonialForm').reset(); // Clear form fields
        } else {
            document.getElementById('submissionStatus').innerText = 'Failed to submit testimonial. Please try again.';
        }
    }


   
    function openExistingTestimonialsModal() {
        // Hide the Add Testimonial modal if it's open
        closeModal('addTestimonialModal').style.display='none';
    
        // Show the Existing Testimonials modal
        document.getElementById('existingTestimonialsModal').style.display = 'block';
    
        // Fetch existing testimonials from the server
        fetch('/get_existing_testimonials')
            .then(response => response.json())
            .then(data => {
                // Check if data exists and if it's an array
                if (data && Array.isArray(data)) {
                    // Clear existing testimonials container
                    const container = document.getElementById('existingTestimonialsContainer');
                    container.innerHTML = '';
    
                    // Iterate over each testimonial and append it to the container
                    data.forEach(testimonial => {
                        const testimonialElement = document.createElement('div');
                        testimonialElement.classList.add('testimonial');
                        testimonialElement.innerHTML = `<p><strong>${testimonial.username}:</strong> ${testimonial.testimonial}</p>`;
                        container.appendChild(testimonialElement);
                    });
                } else {
                    console.error('Error: No existing testimonials data received');
                }
            })
            .catch(error => {
                console.error('Error fetching existing testimonials:', error);
            });
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
    if (modalId === 'addTestimonialModal') {
        // Redirect the user to the home page
        window.location.href = '/';
    }
    
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


// Check if the modal being closed is the "Add Testimonial" modal
if (modalId === 'addTestimonialModal') {
    // Redirect the user to the home page
    window.location.href = '/';
}


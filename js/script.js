// mobile toggle
const mobileBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
}

// Function to validate phone number (exactly 11 digits)
function validatePhoneNumber(phoneValue) {
    // Remove any non-digit characters for validation only
    const digits = phoneValue.replace(/\D/g, '');
    return digits.length === 11;
}

// Function to show error message
function showPhoneError(inputField, message) {
    // Remove any existing error message
    const existingError = inputField.parentElement.querySelector('.phone-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error styling
    inputField.style.borderColor = '#dc3545';
    inputField.style.backgroundColor = '#fff5f5';
    
    // Create error message
    const errorMsg = document.createElement('small');
    errorMsg.className = 'phone-error';
    errorMsg.style.color = '#dc3545';
    errorMsg.style.fontSize = '0.7rem';
    errorMsg.style.display = 'block';
    errorMsg.style.marginTop = '4px';
    errorMsg.innerHTML = message;
    inputField.parentElement.appendChild(errorMsg);
}

// Function to clear phone error
function clearPhoneError(inputField) {
    const existingError = inputField.parentElement.querySelector('.phone-error');
    if (existingError) {
        existingError.remove();
    }
    inputField.style.borderColor = '#ccc';
    inputField.style.backgroundColor = 'white';
}

// Get all telephone input fields
const telephoneInputs = document.querySelectorAll('input[type="tel"], input[name="phone"]');

// Remove any automatic trimming - let user type freely
telephoneInputs.forEach(input => {
    // Remove any existing input restrictions
    input.removeAttribute('maxlength');
    input.removeAttribute('pattern');
    
    // Clear error when user starts typing
    input.addEventListener('input', function() {
        clearPhoneError(this);
    });
    
    // Clear error when field gets focus
    input.addEventListener('focus', function() {
        clearPhoneError(this);
    });
});

/* ============================================ */
/* FORM SUBMISSION - CHECK FOR EXACTLY 11 DIGITS */
/* ============================================ */

// For modal popup form
const popupForm = document.getElementById('popupForm');
if (popupForm) {
    popupForm.addEventListener('submit', function(e) {
        const phoneField = this.querySelector('input[name="phone"]');
        
        if (phoneField) {
            const phoneValue = phoneField.value;
            const digits = phoneValue.replace(/\D/g, '');
            
            // Check if exactly 11 digits
            if (digits.length !== 11) {
                e.preventDefault();
                
                let errorMessage = '';
                if (digits.length === 0) {
                    errorMessage = '⚠️ Please enter your phone number.';
                } else if (digits.length < 11) {
                    errorMessage = `⚠️ You entered ${digits.length} digit(s). Please enter exactly 11 digits.`;
                } else if (digits.length > 11) {
                    errorMessage = `⚠️ You entered ${digits.length} digits. Please enter exactly 11 digits.`;
                }
                
                showPhoneError(phoneField, errorMessage);
                
                // Scroll to top of modal
                const modalContent = document.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.scrollTop = 0;
                }
                return false;
            }
        }
        return true;
    });
}

// For any other forms on the page (contact forms, etc.)
const otherForms = document.querySelectorAll('form:not(#popupForm)');
otherForms.forEach(form => {
    form.addEventListener('submit', function(e) {
        const phoneField = this.querySelector('input[type="tel"], input[name="phone"]');
        
        if (phoneField) {
            const phoneValue = phoneField.value;
            const digits = phoneValue.replace(/\D/g, '');
            
            if (digits.length !== 11) {
                e.preventDefault();
                
                let errorMessage = '';
                if (digits.length === 0) {
                    errorMessage = '⚠️ Please enter your phone number.';
                } else if (digits.length < 11) {
                    errorMessage = `⚠️ You entered ${digits.length} digit(s). South African numbers require 11 digits (e.g., 07123456789).`;
                } else if (digits.length > 11) {
                    errorMessage = `⚠️ You entered ${digits.length} digits. Please enter exactly 11 digits.`;
                }
                
                showPhoneError(phoneField, errorMessage);
                return false;
            }
        }
        return true;
    });
});// Close modal when X is clicked
if (closeModalBtn) {
    closeModalBtn.onclick = function() {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Handle Formspree submission
if (popupForm) {
    popupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const feedbackDiv = document.getElementById('formFeedback');
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                feedbackDiv.className = 'form-message success';
                feedbackDiv.innerHTML = '✅ Thank you! Your request has been sent. We\'ll contact you soon.';
                feedbackDiv.style.display = 'block';
                form.reset();
                
                // Close modal after 2 seconds
                setTimeout(() => {
                    modal.style.display = 'none';
                    feedbackDiv.style.display = 'none';
                }, 2000);
            } else {
                const errorData = await response.json();
                feedbackDiv.className = 'form-message error';
                feedbackDiv.innerHTML = '❌ Oops! Something went wrong. Please email us directly at sales.c4tech@gmail.com';
                feedbackDiv.style.display = 'block';
            }
        } catch (error) {
            feedbackDiv.className = 'form-message error';
            feedbackDiv.innerHTML = '❌ Network error. Please email us directly at sales.c4tech@gmail.com';
            feedbackDiv.style.display = 'block';
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Active nav highlight on scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if(pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navItems.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

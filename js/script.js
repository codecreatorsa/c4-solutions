// mobile toggle
const mobileBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
}

// Error msg for tel num
const phoneInput = document.getElementById("phone");
const errorMsg = document.getElementById("error-msg");

phoneInput.addEventListener("input", function(){
   if (this.value.length > 0){
       errorMsg.style.display = "block";
   }else{
       errorMsg.style.display = "none";
   }
});

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});

// MODAL FUNCTIONALITY - for ALL buttons with data-quote-type
const modal = document.getElementById('quoteModal');
const modalTitle = document.getElementById('modalTitle');
const inquiryTypeInput = document.getElementById('inquiryType');
const closeModalBtn = document.querySelector('.close-modal');
const popupForm = document.getElementById('popupForm');

// Get ALL buttons that have data-quote-type (every Request/Demo/Quote/Chat button)
const ctaButtons = document.querySelectorAll('[data-quote-type]');

// Open modal when any CTA button is clicked
ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const inquiryType = button.getAttribute('data-quote-type');
        inquiryTypeInput.value = inquiryType;
        modalTitle.textContent = inquiryType;
        modal.style.display = 'block';
        
        // Clear previous form feedback and reset form
        const feedbackDiv = document.getElementById('formFeedback');
        feedbackDiv.style.display = 'none';
        feedbackDiv.innerHTML = '';
        feedbackDiv.className = 'form-message';
        
        // Reset form
        popupForm.reset();
    });
});

// Close modal when X is clicked
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

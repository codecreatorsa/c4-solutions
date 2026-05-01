 // Mobile Toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinksEl = document.getElementById('navLinks');
    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => navLinksEl.classList.toggle('show'));
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => item.classList.toggle('active'));
    });

    // ---------- TELEPHONE VALIDATION: ONLY 10 NUMBERS ALLOWED (no trimming, raw input validation) ----------
    const phoneInput = document.getElementById('phone');
    const errorMsgSpan = document.getElementById('error-msg');
    const digitCountSpan = document.getElementById('digitCountDisplay');
    const submitBtn = document.getElementById('submitFormBtn');
    const popupForm = document.getElementById('popupForm');
    
    // Helper: count only numeric digits (0-9) in the raw string.
    function countDigitsOnly(str) {
        let count = 0;
        for(let i = 0; i < str.length; i++) {
            if(str[i] >= '0' && str[i] <= '9') count++;
        }
        return count;
    }
    
    // Extract only digits for validation but preserve raw input value for submission (no trim)
    function validatePhone() {
        let rawValue = phoneInput.value;
        // Count digits in raw input (as user typed, including any extra characters)
        const digitCount = countDigitsOnly(rawValue);
        
        // Update display message with current digit count
        if(digitCountSpan) digitCountSpan.innerText = digitCount;
        
        if(digitCount !== 10) {
            // Show error message
            errorMsgSpan.classList.add('show');
            phoneInput.classList.add('tel-input-error');
            return false;
        } else {
            errorMsgSpan.classList.remove('show');
            phoneInput.classList.remove('tel-input-error');
            return true;
        }
    }
    
    // Real-time validation on input event
    phoneInput.addEventListener('input', function(e) {
        validatePhone();
    });
    
    // Also on blur to give final feedback
    phoneInput.addEventListener('blur', function() {
        validatePhone();
    });
    
    // Override form submission to validate telephone exactly 10 numbers
    if(popupForm) {
        popupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // First, validate telephone (only 10 numbers allowed)
            const isValidTel = validatePhone();
            if(!isValidTel) {
                // Show custom inline error if not valid
                const feedbackDiv = document.getElementById('formFeedback');
                feedbackDiv.className = 'form-message error';
                feedbackDiv.innerHTML = '❌ Telephone number must contain exactly 10 digits. Please correct it before submitting.';
                feedbackDiv.style.display = 'block';
                // Scroll to telephone field
                phoneInput.focus();
                return;
            }
            
            // Additional: ensure the telephone raw digits count = 10, but we also need to keep the raw input as is (no trimming)
            // Exactly as user typed: but on backend we can send raw, but validation passed. GREAT.
            
            const form = e.target;
            const formData = new FormData(form);
            const feedbackDiv = document.getElementById('formFeedback');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if(response.ok) {
                    feedbackDiv.className = 'form-message success';
                    feedbackDiv.innerHTML = '✅ Thank you! Your request has been sent. We\'ll contact you soon.';
                    feedbackDiv.style.display = 'block';
                    form.reset();
                    // clear telephone error states after reset
                    errorMsgSpan.classList.remove('show');
                    phoneInput.classList.remove('tel-input-error');
                    setTimeout(() => {
                        const modal = document.getElementById('quoteModal');
                        modal.style.display = 'none';
                        feedbackDiv.style.display = 'none';
                    }, 2000);
                } else {
                    throw new Error('Submission error');
                }
            } catch(err) {
                feedbackDiv.className = 'form-message error';
                feedbackDiv.innerHTML = '❌ Oops! Something went wrong. Please email us directly at sales.c4tech@gmail.com';
                feedbackDiv.style.display = 'block';
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // MODAL Logic for all CTA buttons
    const modal = document.getElementById('quoteModal');
    const modalTitle = document.getElementById('modalTitle');
    const inquiryTypeInput = document.getElementById('inquiryType');
    const closeModalSpan = document.querySelector('.close-modal');
    const ctaButtons = document.querySelectorAll('[data-quote-type]');
    
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const type = btn.getAttribute('data-quote-type');
            inquiryTypeInput.value = type;
            modalTitle.textContent = type;
            modal.style.display = 'block';
            // Reset form and clear validation errors when modal opens
            popupForm.reset();
            const feedbackDiv = document.getElementById('formFeedback');
            feedbackDiv.style.display = 'none';
            feedbackDiv.innerHTML = '';
            errorMsgSpan.classList.remove('show');
            phoneInput.classList.remove('tel-input-error');
            if(digitCountSpan) digitCountSpan.innerText = '0';
        });
    });
    
    if(closeModalSpan) {
        closeModalSpan.onclick = () => modal.style.display = 'none';
    }
    window.onclick = (event) => {
        if(event.target == modal) modal.style.display = 'none';
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
    
    // initial call for any prefill
    validatePhone();

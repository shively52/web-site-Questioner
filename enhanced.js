// Enhanced form functionality for deployment
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('websiteQuestionnaire');
    const successMessage = document.getElementById('successMessage');
    const newFormButton = document.getElementById('newFormButton');
    const saveButton = document.getElementById('saveButton');
    const resetButton = document.getElementById('resetButton');
    const submitButton = document.getElementById('submitButton');
    
    // Add form progress indicator
    const progressContainer = document.createElement('div');
    progressContainer.className = 'form-progress';
    const progressBar = document.createElement('div');
    progressBar.className = 'form-progress-bar';
    progressContainer.appendChild(progressBar);
    document.body.insertBefore(progressContainer, document.body.firstChild);
    
    // Update progress bar as user scrolls
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const fullHeight = document.body.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        
        const progress = (scrolled / fullHeight) * 100;
        progressBar.style.width = progress + '%';
    });
    
    // Form submission with enhanced validation and data handling
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        // Validate form
        if (validateForm()) {
            // Collect form data
            const formData = new FormData(form);
            const formDataObj = {};
            
            for (const [key, value] of formData.entries()) {
                // Handle checkbox groups (multiple values with same name)
                if (formDataObj[key]) {
                    if (Array.isArray(formDataObj[key])) {
                        formDataObj[key].push(value);
                    } else {
                        formDataObj[key] = [formDataObj[key], value];
                    }
                } else {
                    formDataObj[key] = value;
                }
            }
            
            // Convert to JSON string for storage or sending
            const jsonData = JSON.stringify(formDataObj, null, 2);
            
            // Store in localStorage for demo purposes
            localStorage.setItem('websiteQuestionnaire', jsonData);
            
            // In a real application, you would send this data to a server
            // using fetch or XMLHttpRequest
            
            // Simulate server request
            setTimeout(function() {
                // Show success message
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
                
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = 'Submit Questionnaire';
                
                // Log data to console for demonstration
                console.log('Form data:', formDataObj);
                
                // Scroll to top
                window.scrollTo(0, 0);
            }, 1500);
        } else {
            // Reset button state if validation fails
            submitButton.disabled = false;
            submitButton.innerHTML = 'Submit Questionnaire';
        }
    });
    
    // New form button
    newFormButton.addEventListener('click', function() {
        form.reset();
        successMessage.classList.add('hidden');
        form.classList.remove('hidden');
        window.scrollTo(0, 0);
    });
    
    // Save for later functionality with enhanced feedback
    saveButton.addEventListener('click', function() {
        const formData = new FormData(form);
        const formDataObj = {};
        
        for (const [key, value] of formData.entries()) {
            if (formDataObj[key]) {
                if (Array.isArray(formDataObj[key])) {
                    formDataObj[key].push(value);
                } else {
                    formDataObj[key] = [formDataObj[key], value];
                }
            } else {
                formDataObj[key] = value;
            }
        }
        
        const jsonData = JSON.stringify(formDataObj, null, 2);
        localStorage.setItem('websiteQuestionnaireDraft', jsonData);
        
        // Show save confirmation
        const saveConfirm = document.createElement('div');
        saveConfirm.className = 'save-confirmation';
        saveConfirm.innerHTML = '<i class="fas fa-check-circle"></i> Your responses have been saved. You can return to this page later to continue.';
        saveConfirm.style.position = 'fixed';
        saveConfirm.style.bottom = '20px';
        saveConfirm.style.right = '20px';
        saveConfirm.style.backgroundColor = 'var(--success-color)';
        saveConfirm.style.color = 'white';
        saveConfirm.style.padding = '1rem';
        saveConfirm.style.borderRadius = 'var(--border-radius)';
        saveConfirm.style.boxShadow = 'var(--box-shadow)';
        saveConfirm.style.zIndex = '1000';
        
        document.body.appendChild(saveConfirm);
        
        setTimeout(function() {
            saveConfirm.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(saveConfirm);
            }, 500);
        }, 3000);
    });
    
    // Load saved draft if exists with improved UX
    const savedDraft = localStorage.getItem('websiteQuestionnaireDraft');
    if (savedDraft) {
        // Create a notification instead of an alert
        const draftNotice = document.createElement('div');
        draftNotice.className = 'draft-notification';
        draftNotice.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <strong>Saved Draft Found</strong>
                    <p>We found a saved draft of your questionnaire. Would you like to load it?</p>
                </div>
                <div>
                    <button id="loadDraftBtn" style="background-color: var(--primary-color); color: white; margin-right: 10px;">Load Draft</button>
                    <button id="discardDraftBtn" style="background-color: var(--light-gray); color: var(--dark-gray);">Discard</button>
                </div>
            </div>
        `;
        draftNotice.style.position = 'fixed';
        draftNotice.style.top = '20px';
        draftNotice.style.left = '50%';
        draftNotice.style.transform = 'translateX(-50%)';
        draftNotice.style.backgroundColor = 'white';
        draftNotice.style.padding = '1rem';
        draftNotice.style.borderRadius = 'var(--border-radius)';
        draftNotice.style.boxShadow = 'var(--box-shadow)';
        draftNotice.style.zIndex = '1000';
        draftNotice.style.maxWidth = '600px';
        draftNotice.style.width = '90%';
        
        document.body.appendChild(draftNotice);
        
        document.getElementById('loadDraftBtn').addEventListener('click', function() {
            loadFormData(JSON.parse(savedDraft));
            document.body.removeChild(draftNotice);
        });
        
        document.getElementById('discardDraftBtn').addEventListener('click', function() {
            localStorage.removeItem('websiteQuestionnaireDraft');
            document.body.removeChild(draftNotice);
        });
    }
    
    // Reset button confirmation with improved UX
    resetButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Create a modal dialog
        const modal = document.createElement('div');
        modal.className = 'reset-confirmation-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Reset Form?</h3>
                <p>Are you sure you want to reset the form? All your entries will be lost.</p>
                <div class="modal-actions">
                    <button id="confirmResetBtn" style="background-color: var(--error-color); color: white;">Reset Form</button>
                    <button id="cancelResetBtn" style="background-color: var(--light-gray); color: var(--dark-gray);">Cancel</button>
                </div>
            </div>
        `;
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '2000';
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '2rem';
        modalContent.style.borderRadius = 'var(--border-radius)';
        modalContent.style.maxWidth = '500px';
        modalContent.style.width = '90%';
        
        const modalActions = modal.querySelector('.modal-actions');
        modalActions.style.display = 'flex';
        modalActions.style.justifyContent = 'flex-end';
        modalActions.style.marginTop = '1.5rem';
        modalActions.style.gap = '1rem';
        
        document.body.appendChild(modal);
        
        document.getElementById('confirmResetBtn').addEventListener('click', function() {
            form.reset();
            document.body.removeChild(modal);
        });
        
        document.getElementById('cancelResetBtn').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
    });
    
    // Handle "Other" options with improved UX
    const otherCheckboxes = document.querySelectorAll('input[type="checkbox"][id$="Other"]');
    otherCheckboxes.forEach(function(checkbox) {
        const textInputId = checkbox.id + 'Text';
        const textInput = document.getElementById(textInputId);
        
        if (textInput) {
            // Disable text input initially if checkbox is not checked
            textInput.disabled = !checkbox.checked;
            
            // Toggle text input based on checkbox state
            checkbox.addEventListener('change', function() {
                textInput.disabled = !this.checked;
                if (this.checked) {
                    textInput.focus();
                }
            });
        }
    });
    
    // Same for radio buttons with "Other" option
    const otherRadios = document.querySelectorAll('input[type="radio"][id$="Other"]');
    otherRadios.forEach(function(radio) {
        const textInputId = radio.id + 'Text';
        const textInput = document.getElementById(textInputId);
        
        if (textInput) {
            // Check all radios in the same group
            const radioGroup = document.querySelectorAll(`input[name="${radio.name}"]`);
            
            // Disable text input initially if radio is not checked
            textInput.disabled = !radio.checked;
            
            // Add event listeners to all radios in the group
            radioGroup.forEach(function(groupRadio) {
                groupRadio.addEventListener('change', function() {
                    textInput.disabled = !radio.checked;
                    if (radio.checked) {
                        textInput.focus();
                    }
                });
            });
        }
    });
    
    // Form validation function with improved error handling
    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        // Remove any existing error messages
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(function(message) {
            message.remove();
        });
        
        // Reset field styling
        const allFields = form.querySelectorAll('input, textarea, select');
        allFields.forEach(function(field) {
            field.style.borderColor = '';
        });
        
        // Check each required field
        requiredFields.forEach(function(field) {
            if (!field.value.trim()) {
                isValid = false;
                
                // Highlight field
                field.style.borderColor = 'var(--error-color)';
                
                // Add error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'This field is required';
                
                field.parentNode.appendChild(errorMessage);
                
                // Scroll to first error
                if (field === requiredFields[0]) {
                    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
        
        // Check if at least one checkbox is selected in required groups
        const checkboxGroups = ['goals', 'metrics', 'essentialFeatures'];
        
        checkboxGroups.forEach(function(groupName) {
            const checkboxes = form.querySelectorAll(`input[name="${groupName}"]`);
            if (checkboxes.length > 0) {
                let isChecked = false;
                
                checkboxes.forEach(function(checkbox) {
                    if (checkbox.checked) {
                        isChecked = true;
                    }
                });
                
                if (!isChecked) {
                    isValid = false;
                    
                    // Get the group container
                    const groupContainer = checkboxes[0].closest('.form-group');
                    
                    // Add error message
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'Please select at least one option';
                    
                    groupContainer.appendChild(errorMessage);
                    
                    // Scroll to first error group
                    if (groupName === checkboxGroups[0]) {
                        groupContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
        });
        
        return isValid;
    }
    
    // Function to load saved form data with improved handling
    function loadFormData(data) {
        // Process each field in the saved data
        for (const [key, value] of Object.entries(data)) {
            const field = form.querySelector(`[name="${key}"]`);
            
            if (field) {
                // Handle different field types
                if (field.type === 'checkbox' || field.type === 'radio') {
                    // For checkbox/radio groups
                    const fields = form.querySelectorAll(`[name="${key}"]`);
                    
                    fields.forEach(function(f) {
                        if (Array.isArray(value)) {
                            // Multiple values (checkboxes)
                            if (value.includes(f.value)) {
                                f.checked = true;
                                
                                // Trigger change event for "Other" options
                                if (f.id.endsWith('Other')) {
                                    const event = new Event('change');
                                    f.dispatchEvent(event);
                                }
                            }
                        } else {
                            // Single value (radio)
                            if (f.value === value) {
                                f.checked = true;
                                
                                // Trigger change event for "Other" options
                                if (f.id.endsWith('Other')) {
                                    const event = new Event('change');
                                    f.dispatchEvent(event);
                                }
                            }
                        }
                    });
                } else {
                    // For text inputs, textareas, etc.
                    field.value = value;
                }
            } else if (key.endsWith('OtherText')) {
                // Handle "Other" text inputs
                const otherTextField = document.getElementById(key);
                if (otherTextField) {
                    otherTextField.value = value;
                }
            }
        }
    }
    
    // Add smooth scrolling for section navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

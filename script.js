document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('websiteQuestionnaire');
    const successMessage = document.getElementById('successMessage');
    const newFormButton = document.getElementById('newFormButton');
    const saveButton = document.getElementById('saveButton');
    const resetButton = document.getElementById('resetButton');
    
    // Save for later functionality
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
        
        alert('Your responses have been saved. You can return to this page later to continue.');
    });
    
    // Load saved draft if exists
    const savedDraft = localStorage.getItem('websiteQuestionnaireDraft');
    if (savedDraft) {
        const shouldLoad = confirm('We found a saved draft of your questionnaire. Would you like to load it?');
        
        if (shouldLoad) {
            loadFormData(JSON.parse(savedDraft));
        } else {
            localStorage.removeItem('websiteQuestionnaireDraft');
        }
    }
    
    // Reset button confirmation
    resetButton.addEventListener('click', function(e) {
        const confirmed = confirm('Are you sure you want to reset the form? All your entries will be lost.');
        
        if (!confirmed) {
            e.preventDefault();
        }
    });
    
    // Handle "Other" options
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
    
    // Function to load saved form data
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

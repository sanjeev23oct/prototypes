/**
 * Form Validation Module
 * Advanced validation rules and real-time feedback
 */

const Validation = {
    // Validation rules
    rules: {
        required: (value) => Utils.validate.required(value),
        email: (value) => !value || Utils.validate.email(value),
        phone: (value) => !value || Utils.validate.phone(value),
        minLength: (value, min) => !value || Utils.validate.minLength(value, min),
        maxLength: (value, max) => Utils.validate.maxLength(value, max),
        futureDate: (value) => {
            if (!value) return true;
            const date = new Date(value);
            const now = new Date();
            return date > now;
        },
        dateRange: (startDate, endDate) => {
            if (!startDate || !endDate) return true;
            const start = new Date(startDate);
            const end = new Date(endDate);
            return end > start;
        }
    },

    // Error messages
    messages: {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid phone number',
        minLength: 'Minimum length is {min} characters',
        maxLength: 'Maximum length is {max} characters',
        futureDate: 'Date must be in the future',
        dateRange: 'End date must be after start date'
    },

    /**
     * Initialize validation system
     */
    init() {
        this.setupRealTimeValidation();
        this.setupCustomValidators();
    },

    /**
     * Setup real-time validation
     */
    setupRealTimeValidation() {
        const form = Utils.dom.get('singlePageForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            // Validate on input (debounced)
            input.addEventListener('input', Utils.async.debounce(() => {
                if (input.classList.contains('invalid')) {
                    this.validateField(input);
                }
            }, 500));
        });
    },

    /**
     * Setup custom validators
     */
    setupCustomValidators() {
        // Date range validation
        const startDateInput = Utils.dom.get('singlePageForm')?.querySelector('input[name="startDate"]');
        const endDateInput = Utils.dom.get('singlePageForm')?.querySelector('input[name="endDate"]');

        if (startDateInput && endDateInput) {
            const validateDateRange = () => {
                const startDate = startDateInput.value;
                const endDate = endDateInput.value;

                if (startDate && endDate) {
                    const isValid = this.rules.dateRange(startDate, endDate);
                    
                    if (!isValid) {
                        this.showFieldError(endDateInput, 'dateRange');
                        endDateInput.classList.add('invalid');
                    } else {
                        this.clearFieldError(endDateInput);
                        endDateInput.classList.remove('invalid');
                    }
                }
            };

            startDateInput.addEventListener('change', validateDateRange);
            endDateInput.addEventListener('change', validateDateRange);
        }
    },

    /**
     * Validate individual field
     */
    validateField(field) {
        const rules = field.dataset.validate;
        if (!rules) return true;

        const value = field.value;
        let isValid = true;

        // Clear previous errors
        this.clearFieldError(field);

        // Parse and apply rules
        const ruleList = rules.split('|');
        
        for (const rule of ruleList) {
            const [ruleName, ...params] = rule.split(':');
            const ruleFunction = this.rules[ruleName];

            if (ruleFunction) {
                const ruleValid = ruleFunction(value, ...params);
                if (!ruleValid) {
                    this.showFieldError(field, ruleName, params);
                    isValid = false;
                    break;
                }
            }
        }

        // Update field styling
        if (isValid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
        }

        return isValid;
    },

    /**
     * Show field error
     */
    showFieldError(field, ruleName, params = []) {
        let message = this.messages[ruleName] || 'Invalid value';

        // Replace placeholders in message
        params.forEach((param, index) => {
            const placeholder = `{${Object.keys(this.messages)[index] || index}}`;
            message = message.replace(placeholder, param);
        });

        // Create or update error element
        let errorElement = field.parentNode.querySelector('.form-error');
        if (!errorElement) {
            errorElement = Utils.dom.create('div', {
                className: 'form-error'
            });
            field.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;
        
        // Add shake animation
        field.classList.add('shake');
        setTimeout(() => field.classList.remove('shake'), 820);
    },

    /**
     * Clear field error
     */
    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    },

    /**
     * Validate entire form
     */
    validateForm(form) {
        if (typeof form === 'string') form = Utils.dom.get(form);
        
        const fields = form.querySelectorAll('[data-validate]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    },

    /**
     * Custom validation for work clearance form
     */
    validateWorkClearanceForm() {
        const errors = [];

        // Check if at least one department is selected
        if (FormHandler.state.selectedDepartments.size === 0) {
            errors.push('At least one department must be selected for notification');
        }

        // Check if priority is selected
        if (!FormHandler.state.selectedPriority) {
            errors.push('Priority level must be selected');
        }

        // Validate work type and risk level combination
        const workTypeSelect = Utils.dom.get('singlePageForm').querySelector('select[name="workType"]');
        const workType = MockData.getWorkType(workTypeSelect.value);
        
        if (workType && workType.riskLevel === 'high') {
            // High risk work requires additional validation
            const safetyMeasures = Utils.dom.get('singlePageForm').querySelector('textarea[name="safetyMeasures"]').value;
            if (!safetyMeasures.trim()) {
                errors.push('Safety measures are required for high-risk work');
            }
        }

        // Validate infrastructure selection for digging work
        if (workType && workType.id === 'digging' && FormHandler.state.selectedInfrastructure.size === 0) {
            errors.push('Infrastructure assessment is required for excavation work');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    /**
     * Show validation summary
     */
    showValidationSummary(errors) {
        if (errors.length === 0) return;

        const errorList = errors.map(error => `• ${error}`).join('\n');
        Components.toast.error(`Please fix the following issues:\n${errorList}`, 8000);
    },

    /**
     * Highlight invalid sections
     */
    highlightInvalidSections() {
        const sections = ['basic', 'schedule', 'infrastructure', 'departments', 'contact'];
        
        sections.forEach(sectionName => {
            const isValid = FormHandler.validateSection(sectionName);
            const section = Utils.dom.get('singlePageForm').querySelector(`[data-section="${sectionName}"]`);
            
            if (!isValid && section) {
                // Add attention-grabbing animation
                section.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    section.style.animation = '';
                }, 500);
            }
        });
    },

    /**
     * Smart validation suggestions
     */
    provideSuggestions(field) {
        const fieldName = field.name;
        const value = field.value.trim();

        switch (fieldName) {
            case 'title':
                if (value.length > 0 && value.length < 10) {
                    return 'Consider providing a more descriptive title';
                }
                break;
                
            case 'description':
                if (value.length > 0 && value.length < 50) {
                    return 'A more detailed description will help with approval';
                }
                break;
                
            case 'emergencyContact':
                if (value && !value.startsWith('+91')) {
                    return 'Consider including country code (+91)';
                }
                break;
        }

        return null;
    },

    /**
     * Progressive validation
     */
    enableProgressiveValidation() {
        const form = Utils.dom.get('singlePageForm');
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach((input, index) => {
            input.addEventListener('focus', () => {
                // Validate previous fields when focusing on new field
                for (let i = 0; i < index; i++) {
                    if (inputs[i].dataset.validate) {
                        this.validateField(inputs[i]);
                    }
                }
            });
        });
    },

    /**
     * Accessibility validation feedback
     */
    announceValidationResult(field, isValid, message) {
        // Create or update ARIA live region for screen readers
        let liveRegion = document.querySelector('#validation-announcements');
        if (!liveRegion) {
            liveRegion = Utils.dom.create('div', {
                id: 'validation-announcements',
                className: 'sr-only',
                'aria-live': 'polite',
                'aria-atomic': 'true'
            });
            document.body.appendChild(liveRegion);
        }

        const fieldLabel = field.previousElementSibling?.textContent || field.name;
        const announcement = isValid 
            ? `${fieldLabel} is valid`
            : `${fieldLabel} error: ${message}`;
            
        liveRegion.textContent = announcement;
        
        // Clear announcement after a delay
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 3000);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validation;
}
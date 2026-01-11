/**
 * DAK System Components
 * Reusable UI components for DAK Handling System
 */

const DAKComponents = {
    /**
     * Toast notifications
     */
    toast: {
        show: (message, type = 'info', duration = 3000) => {
            const container = Utils.dom.get('toastContainer');
            const toast = Utils.dom.create('div', {
                className: `toast toast-${type} slide-in-right`
            });
            
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                warning: 'fa-exclamation-triangle',
                info: 'fa-info-circle'
            };
            
            toast.innerHTML = `
                <i class="fas ${icons[type]}"></i>
                <span>${message}</span>
                <button class="toast-close">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            container.appendChild(toast);
            
            // Close button handler
            toast.querySelector('.toast-close').addEventListener('click', () => {
                toast.remove();
            });
            
            // Auto remove
            if (duration > 0) {
                setTimeout(() => {
                    toast.style.opacity = '0';
                    setTimeout(() => toast.remove(), 300);
                }, duration);
            }
        },
        
        success: (message, duration) => DAKComponents.toast.show(message, 'success', duration),
        error: (message, duration) => DAKComponents.toast.show(message, 'error', duration),
        warning: (message, duration) => DAKComponents.toast.show(message, 'warning', duration),
        info: (message, duration) => DAKComponents.toast.show(message, 'info', duration)
    },

    /**
     * Modal management
     */
    modal: {
        show: (modalId) => {
            const modal = Utils.dom.get(modalId);
            if (modal) {
                Utils.dom.show(modal);
                document.body.style.overflow = 'hidden';
            }
            return modal;
        },
        
        hide: (modalId) => {
            const modal = Utils.dom.get(modalId);
            if (modal) {
                Utils.dom.hide(modal);
                document.body.style.overflow = '';
            }
        }
    },

    /**
     * Form validation
     */
    validation: {
        validateForm: (form) => {
            let isValid = true;
            const inputs = form.querySelectorAll('[data-validate]');
            
            inputs.forEach(input => {
                const rules = input.getAttribute('data-validate').split('|');
                const value = input.value.trim();
                
                rules.forEach(rule => {
                    if (rule === 'required' && !value) {
                        DAKComponents.validation.showError(input, 'This field is required');
                        isValid = false;
                    }
                    
                    if (rule.startsWith('minLength:')) {
                        const minLength = parseInt(rule.split(':')[1]);
                        if (value && value.length < minLength) {
                            DAKComponents.validation.showError(input, `Minimum ${minLength} characters required`);
                            isValid = false;
                        }
                    }
                    
                    if (rule === 'email' && value && !Utils.validate.email(value)) {
                        DAKComponents.validation.showError(input, 'Invalid email address');
                        isValid = false;
                    }
                    
                    if (rule === 'number' && value && !Utils.validate.number(value)) {
                        DAKComponents.validation.showError(input, 'Must be a valid number');
                        isValid = false;
                    }
                });
                
                if (isValid) {
                    DAKComponents.validation.clearError(input);
                }
            });
            
            return isValid;
        },
        
        showError: (input, message) => {
            input.classList.add('invalid');
            input.classList.remove('valid');
            
            let errorDiv = input.parentElement.querySelector('.form-error');
            if (!errorDiv) {
                errorDiv = Utils.dom.create('div', { className: 'form-error' });
                input.parentElement.appendChild(errorDiv);
            }
            errorDiv.textContent = message;
        },
        
        clearError: (input) => {
            input.classList.remove('invalid');
            input.classList.add('valid');
            
            const errorDiv = input.parentElement.querySelector('.form-error');
            if (errorDiv) {
                errorDiv.remove();
            }
        }
    },

    /**
     * Render letter trail timeline
     */
    renderLetterTrail: (trail) => {
        if (!trail || trail.length === 0) {
            return '<p class="text-gray-500">No trail history available</p>';
        }
        
        return `
            <div class="letter-trail">
                ${trail.map(item => `
                    <div class="trail-item completed">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <div class="font-semibold text-gray-900">${item.action}</div>
                                <div class="text-sm text-gray-600">${item.by} - ${item.office}</div>
                            </div>
                            <div class="text-xs text-gray-500">
                                ${Utils.date.formatDateTime(item.date)}
                            </div>
                        </div>
                        ${item.details ? `<div class="text-sm text-gray-600 mt-1">${item.details}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Render message thread
     */
    renderMessages: (messages) => {
        if (!messages || messages.length === 0) {
            return '<p class="text-gray-500">No messages</p>';
        }
        
        return `
            <div class="message-thread">
                ${messages.map(msg => `
                    <div class="message-item ${msg.type}">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <div class="font-semibold text-gray-900">${msg.from}</div>
                                <div class="text-sm text-gray-600">To: ${msg.to}</div>
                            </div>
                            <div class="text-xs text-gray-500">
                                ${Utils.date.formatDateTime(msg.date)}
                            </div>
                        </div>
                        <div class="font-medium text-gray-800 mb-1">${msg.subject}</div>
                        <div class="text-sm text-gray-700">${msg.message}</div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Render email trail
     */
    renderEmailTrail: (emailTrail) => {
        if (!emailTrail || emailTrail.length === 0) {
            return '<p class="text-gray-500">No emails sent</p>';
        }
        
        return `
            <div class="space-y-3">
                ${emailTrail.map(email => `
                    <div class="email-trail-item ${email.status}">
                        <div class="flex-shrink-0">
                            <i class="fas ${email.status === 'sent' ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500'} text-xl"></i>
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-start mb-1">
                                <div class="font-medium text-gray-900">${email.subject}</div>
                                <div class="text-xs text-gray-500">${Utils.date.formatDateTime(email.sentAt)}</div>
                            </div>
                            <div class="text-sm text-gray-600 mb-1">To: ${email.to}</div>
                            <div class="text-sm text-gray-700">${email.body}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    /**
     * File upload handler
     */
    handleFileUpload: (event, callback) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        
        const file = files[0];
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            DAKComponents.toast.error('Only JPG, PNG, and PDF files are allowed');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            DAKComponents.toast.error('File size must be less than 5MB');
            return;
        }
        
        // Create file preview
        const reader = new FileReader();
        reader.onload = (e) => {
            if (callback) {
                callback({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: e.target.result
                });
            }
        };
        reader.readAsDataURL(file);
        
        DAKComponents.toast.success('File uploaded successfully');
    },

    /**
     * Render file preview
     */
    renderFilePreview: (file) => {
        const fileIcon = file.type.includes('pdf') ? 'fa-file-pdf' : 'fa-file-image';
        const fileSize = Utils.file ? Utils.file.formatSize(file.size) : `${Math.round(file.size / 1024)} KB`;
        
        return `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                    <i class="fas ${fileIcon} text-2xl text-blue-500"></i>
                    <div>
                        <div class="text-sm font-medium text-gray-900">${file.name}</div>
                        <div class="text-xs text-gray-500">${fileSize}</div>
                    </div>
                </div>
                <button type="button" class="text-red-500 hover:text-red-700" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DAKComponents;
}

console.log('✓ dak-components.js loaded successfully');

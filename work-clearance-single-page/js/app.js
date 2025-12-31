/**
 * Main Application Entry Point for Single Page Work Clearance
 * Initializes all modules and manages application lifecycle
 */

const SinglePageApp = {
    config: {
        version: '1.0.0',
        name: 'RSSB Bhati Work Clearance - Single Page',
        debug: true
    },

    /**
     * Initialize the application
     */
    init() {
        this.log('Initializing Single Page Work Clearance System...');
        
        // Check browser compatibility
        if (!this.checkCompatibility()) {
            this.showCompatibilityError();
            return;
        }

        // Initialize all modules
        this.initializeModules();
        
        // Setup global error handling
        this.setupErrorHandling();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Load draft if exists
        this.loadDraftIfExists();
        
        // Setup auto-save
        this.setupAutoSave();
        
        this.log('Single Page Application initialized successfully');
        
        // Show welcome message
        this.showWelcomeMessage();
    },

    /**
     * Check browser compatibility
     */
    checkCompatibility() {
        const requiredFeatures = [
            'localStorage' in window,
            'JSON' in window,
            'Promise' in window,
            'Set' in window,
            'Map' in window
        ];
        
        return requiredFeatures.every(feature => feature);
    },

    /**
     * Show compatibility error
     */
    showCompatibilityError() {
        document.body.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-50">
                <div class="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                    <h2 class="text-xl font-semibold text-gray-900 mb-2">Browser Not Supported</h2>
                    <p class="text-gray-600 mb-4">
                        Your browser doesn't support some features required by this application.
                        Please update your browser or use a modern browser.
                    </p>
                    <button onclick="location.reload()" class="btn btn-primary">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Initialize all modules
     */
    initializeModules() {
        try {
            // Initialize components first
            Components.toast.init();
            
            // Initialize validation system
            Validation.init();
            
            // Initialize form handler
            FormHandler.init();
            
            this.log('All modules initialized successfully');
        } catch (error) {
            this.handleError(error, 'Module Initialization Error');
        }
    },

    /**
     * Setup global error handling
     */
    setupErrorHandling() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            this.handleError(event.error, 'Uncaught Error');
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Unhandled Promise Rejection');
        });
        
        this.log('Error handling setup complete');
    },

    /**
     * Handle application errors
     */
    handleError(error, context = 'Application Error') {
        this.log(`${context}:`, error);
        
        // Show user-friendly error message
        Components.toast.error(
            'An unexpected error occurred. Please refresh the page and try again.',
            10000
        );
        
        // In production, send error reports to logging service
        if (this.config.debug) {
            console.error(`${context}:`, error);
        }
    },

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        const shortcuts = {
            'ctrl+s': (e) => {
                e.preventDefault();
                window.saveAsDraft();
            },
            'ctrl+enter': (e) => {
                e.preventDefault();
                const form = Utils.dom.get('singlePageForm');
                if (form) {
                    FormHandler.handleSubmit();
                }
            },
            'ctrl+r': (e) => {
                e.preventDefault();
                window.resetForm();
            },
            'escape': () => this.handleEscapeKey(),
            'ctrl+/': () => this.showKeyboardShortcuts()
        };
        
        document.addEventListener('keydown', (event) => {
            const key = this.getKeyboardShortcut(event);
            const handler = shortcuts[key];
            
            if (handler) {
                handler(event);
            }
        });
        
        this.log('Keyboard shortcuts setup complete');
    },

    /**
     * Get keyboard shortcut string from event
     */
    getKeyboardShortcut(event) {
        const parts = [];
        
        if (event.ctrlKey || event.metaKey) parts.push('ctrl');
        if (event.altKey) parts.push('alt');
        if (event.shiftKey) parts.push('shift');
        
        parts.push(event.key.toLowerCase());
        
        return parts.join('+');
    },

    /**
     * Handle escape key press
     */
    handleEscapeKey() {
        // Close any open modals
        const openModals = document.querySelectorAll('.modal:not(.hidden)');
        if (openModals.length > 0) {
            const topModal = openModals[openModals.length - 1];
            Components.modal.hide(topModal.id);
            return;
        }
    },

    /**
     * Show keyboard shortcuts help
     */
    showKeyboardShortcuts() {
        const shortcuts = [
            { key: 'Ctrl + S', description: 'Save as draft' },
            { key: 'Ctrl + Enter', description: 'Submit form' },
            { key: 'Ctrl + R', description: 'Reset form' },
            { key: 'Ctrl + /', description: 'Show this help' },
            { key: 'Escape', description: 'Close modal' }
        ];
        
        const content = `
            <div class="space-y-4">
                <h4 class="text-lg font-semibold">Keyboard Shortcuts</h4>
                <div class="space-y-2">
                    ${shortcuts.map(shortcut => `
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">${shortcut.description}</span>
                            <kbd class="px-2 py-1 bg-gray-100 rounded text-xs font-mono">${shortcut.key}</kbd>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        Components.modal.show('helpModal', {
            title: 'Keyboard Shortcuts',
            content: content
        });
    },

    /**
     * Load draft if exists
     */
    loadDraftIfExists() {
        const draft = Utils.storage.get('workRequestDraft');
        if (draft) {
            const loadDraft = confirm('A saved draft was found. Would you like to load it?');
            if (loadDraft) {
                this.loadFormData(draft);
                Components.toast.info('Draft loaded successfully');
            } else {
                Utils.storage.remove('workRequestDraft');
            }
        }
    },

    /**
     * Load form data from draft
     */
    loadFormData(data) {
        const form = Utils.dom.get('singlePageForm');
        
        // Load basic form fields
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field && data[key]) {
                field.value = data[key];
            }
        });

        // Load priority selection
        if (data.priority) {
            FormHandler.selectPriority(data.priority);
        }

        // Load department selections
        if (data.notifyDepartments) {
            data.notifyDepartments.forEach(dept => {
                const checkbox = Utils.dom.get('departmentGrid').querySelector(`input[value="${dept.id}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    FormHandler.toggleDepartment(dept.id, true);
                }
            });
        }

        // Load infrastructure selections
        if (data.infrastructureAffected) {
            data.infrastructureAffected.forEach(infraId => {
                const checkbox = Utils.dom.get('infrastructureGrid').querySelector(`input[value="${infraId}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    FormHandler.toggleInfrastructure(infraId, true);
                }
            });
        }

        // Trigger validation and progress update
        FormHandler.updateProgress();
    },

    /**
     * Setup auto-save functionality
     */
    setupAutoSave() {
        let autoSaveTimer;
        
        const form = Utils.dom.get('singlePageForm');
        const inputs = form.querySelectorAll('input, select, textarea');
        
        const triggerAutoSave = Utils.async.debounce(() => {
            if (this.hasFormData()) {
                const formData = FormHandler.collectFormData();
                Utils.storage.set('workRequestDraft', formData);
                
                // Show subtle indication
                const indicator = this.createAutoSaveIndicator();
                setTimeout(() => indicator.remove(), 2000);
            }
        }, 5000); // Auto-save after 5 seconds of inactivity
        
        inputs.forEach(input => {
            input.addEventListener('input', triggerAutoSave);
            input.addEventListener('change', triggerAutoSave);
        });
        
        this.log('Auto-save setup complete');
    },

    /**
     * Check if form has any data
     */
    hasFormData() {
        const form = Utils.dom.get('singlePageForm');
        const inputs = form.querySelectorAll('input, select, textarea');
        
        return Array.from(inputs).some(input => {
            return input.value.trim() !== '' || 
                   FormHandler.state.selectedPriority ||
                   FormHandler.state.selectedDepartments.size > 0 ||
                   FormHandler.state.selectedInfrastructure.size > 0;
        });
    },

    /**
     * Create auto-save indicator
     */
    createAutoSaveIndicator() {
        const indicator = Utils.dom.create('div', {
            className: 'fixed bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded text-sm',
            style: 'z-index: 1000; animation: fadeIn 0.3s ease-out;'
        }, '✓ Draft saved');
        
        document.body.appendChild(indicator);
        return indicator;
    },

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        const hasVisited = Utils.storage.get('hasVisitedSinglePage');
        
        if (!hasVisited) {
            setTimeout(() => {
                Components.toast.info(
                    'Welcome to the single-page work clearance form! All sections are visible at once for faster completion.',
                    6000
                );
                Utils.storage.set('hasVisitedSinglePage', true);
            }, 1500);
        }
    },

    /**
     * Logging utility
     */
    log(...args) {
        if (this.config.debug) {
            console.log(`[${this.config.name}]`, ...args);
        }
    },

    /**
     * Get application info
     */
    getInfo() {
        return {
            name: this.config.name,
            version: this.config.version,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            formState: {
                completedSections: Array.from(FormHandler.state.completedSections),
                selectedDepartments: Array.from(FormHandler.state.selectedDepartments),
                selectedInfrastructure: Array.from(FormHandler.state.selectedInfrastructure),
                selectedPriority: FormHandler.state.selectedPriority
            }
        };
    },

    /**
     * Export form data
     */
    exportFormData() {
        const formData = FormHandler.collectFormData();
        const exportData = {
            formData: formData,
            appInfo: this.getInfo(),
            exportedAt: new Date().toISOString()
        };
        
        const filename = `work-request-${formData.id || 'draft'}-${Utils.date.format(new Date()).replace(/\//g, '-')}.json`;
        
        Utils.file.download(JSON.stringify(exportData, null, 2), filename, 'application/json');
        Components.toast.success('Form data exported successfully!');
    }
};

// Create help modal if it doesn't exist
document.addEventListener('DOMContentLoaded', () => {
    if (!Utils.dom.get('helpModal')) {
        const helpModal = Utils.dom.create('div', {
            id: 'helpModal',
            className: 'modal hidden'
        });
        
        helpModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="text-xl font-semibold">Help</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Content will be populated dynamically -->
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="Components.modal.hide('helpModal')">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(helpModal);
    }
});

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    SinglePageApp.init();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        SinglePageApp.log('Application paused (tab hidden)');
    } else {
        SinglePageApp.log('Application resumed (tab visible)');
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    Components.toast.success('Connection restored');
});

window.addEventListener('offline', () => {
    Components.toast.warning('You are now offline. Your work will be saved locally.');
});

// Export App for global access
window.SinglePageApp = SinglePageApp;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SinglePageApp;
}
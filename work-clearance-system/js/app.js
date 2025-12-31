/**
 * Main Application Entry Point
 * Initializes the Work Clearance System
 */

// Application state and configuration
const App = {
    config: {
        version: '1.0.0',
        name: 'RSSB Bhati Work Clearance System',
        debug: true
    },

    /**
     * Initialize the application
     */
    init() {
        this.log('Initializing Work Clearance System...');
        
        // Check browser compatibility
        if (!this.checkCompatibility()) {
            this.showCompatibilityError();
            return;
        }

        // Initialize components
        this.initializeComponents();
        
        // Initialize the main system
        WorkClearanceSystem.init();
        
        // Setup global error handling
        this.setupErrorHandling();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Setup service worker (for future PWA support)
        this.setupServiceWorker();
        
        this.log('Application initialized successfully');
        
        // Show welcome message for first-time users
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
            'fetch' in window || 'XMLHttpRequest' in window
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
                        Please update your browser or use a modern browser like Chrome, Firefox, or Safari.
                    </p>
                    <button onclick="location.reload()" class="btn btn-primary">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Initialize all components
     */
    initializeComponents() {
        // Initialize toast system
        Components.toast.init();
        
        // Initialize validation system
        Components.validation.init();
        
        // Initialize dropdown components
        Components.dropdown.init();
        
        // Initialize tab components
        Components.tabs.init();
        
        this.log('Components initialized');
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
        
        // In production, you might want to send error reports to a logging service
        if (this.config.debug) {
            console.error(`${context}:`, error);
        }
    },

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        const shortcuts = {
            'ctrl+n': () => WorkClearanceSystem.showNewRequestModal(),
            'ctrl+m': () => WorkClearanceSystem.showCampusMap(),
            'ctrl+r': () => WorkClearanceSystem.showReports(),
            'ctrl+s': () => WorkClearanceSystem.showSettings(),
            'escape': () => this.handleEscapeKey(),
            'ctrl+/': () => this.showKeyboardShortcuts()
        };
        
        document.addEventListener('keydown', (event) => {
            const key = this.getKeyboardShortcut(event);
            const handler = shortcuts[key];
            
            if (handler) {
                event.preventDefault();
                handler();
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
        
        // Close any open dropdowns
        Components.dropdown.closeAll();
    },

    /**
     * Show keyboard shortcuts help
     */
    showKeyboardShortcuts() {
        const shortcuts = [
            { key: 'Ctrl + N', description: 'New work request' },
            { key: 'Ctrl + M', description: 'Show campus map' },
            { key: 'Ctrl + R', description: 'Show reports' },
            { key: 'Ctrl + S', description: 'Show settings' },
            { key: 'Ctrl + /', description: 'Show this help' },
            { key: 'Escape', description: 'Close modal/dropdown' }
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
     * Setup service worker for PWA support
     */
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    this.log('Service Worker registered:', registration);
                })
                .catch((error) => {
                    this.log('Service Worker registration failed:', error);
                });
        }
    },

    /**
     * Show welcome message for new users
     */
    showWelcomeMessage() {
        const hasVisited = Utils.storage.get('hasVisited');
        
        if (!hasVisited) {
            setTimeout(() => {
                Components.toast.info(
                    'Welcome to RSSB Bhati Work Clearance System! Click "New Work Request" to get started.',
                    8000
                );
                Utils.storage.set('hasVisited', true);
            }, 2000);
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
            localStorage: this.getStorageInfo(),
            performance: this.getPerformanceInfo()
        };
    },

    /**
     * Get storage information
     */
    getStorageInfo() {
        try {
            const used = JSON.stringify(localStorage).length;
            const available = 5 * 1024 * 1024; // Approximate 5MB limit
            
            return {
                used: Utils.file.formatSize(used),
                available: Utils.file.formatSize(available),
                percentage: Math.round((used / available) * 100)
            };
        } catch (error) {
            return { error: 'Unable to calculate storage info' };
        }
    },

    /**
     * Get performance information
     */
    getPerformanceInfo() {
        if ('performance' in window && performance.timing) {
            const timing = performance.timing;
            return {
                loadTime: timing.loadEventEnd - timing.navigationStart,
                domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
            };
        }
        return { error: 'Performance API not available' };
    },

    /**
     * Export application data
     */
    exportData() {
        const data = {
            workRequests: Utils.storage.get('workRequests', []),
            appInfo: this.getInfo(),
            exportedAt: new Date().toISOString()
        };
        
        const filename = `work-clearance-data-${Utils.date.format(new Date(), { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        }).replace(/\//g, '-')}.json`;
        
        Utils.file.download(JSON.stringify(data, null, 2), filename, 'application/json');
        
        Components.toast.success('Data exported successfully!');
    },

    /**
     * Import application data
     */
    async importData(file) {
        try {
            const content = await Utils.file.readAsText(file);
            const data = JSON.parse(content);
            
            if (data.workRequests && Array.isArray(data.workRequests)) {
                const confirmed = await Components.modal.confirm(
                    `This will replace all existing data with ${data.workRequests.length} work requests. Continue?`,
                    'Import Data'
                );
                
                if (confirmed) {
                    Utils.storage.set('workRequests', data.workRequests);
                    WorkClearanceSystem.loadData();
                    WorkClearanceSystem.renderDashboard();
                    WorkClearanceSystem.renderWorkRequests();
                    
                    Components.toast.success('Data imported successfully!');
                }
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            Components.toast.error('Failed to import data. Please check the file format.');
            this.handleError(error, 'Data Import Error');
        }
    },

    /**
     * Reset application data
     */
    async resetData() {
        const confirmed = await Components.modal.confirm(
            'This will delete all work requests and reset the application. This action cannot be undone.',
            'Reset Application Data'
        );
        
        if (confirmed) {
            Utils.storage.clear();
            location.reload();
        }
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
            <div class="modal-content max-w-md">
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
    App.init();
});

// Handle page visibility changes (for pausing/resuming updates)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        App.log('Application paused (tab hidden)');
    } else {
        App.log('Application resumed (tab visible)');
        // Refresh data when tab becomes visible again
        WorkClearanceSystem.renderDashboard();
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    Components.toast.success('Connection restored');
});

window.addEventListener('offline', () => {
    Components.toast.warning('You are now offline. Some features may not work.');
});

// Export App for global access
window.App = App;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
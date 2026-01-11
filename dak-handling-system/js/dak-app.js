/**
 * DAK Handling System - Application Entry Point
 * Initialize and start the application
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing DAK Handling System...');
    
    try {
        // Initialize the system
        DAKSystem.init();
        
        console.log('✅ DAK Handling System initialized successfully');
        
        // Show welcome message
        setTimeout(() => {
            DAKComponents.toast.success('Welcome to DAK Handling System', 2000);
        }, 500);
        
    } catch (error) {
        console.error('❌ Error initializing DAK Handling System:', error);
        DAKComponents.toast.error('Failed to initialize system. Please refresh the page.');
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Reload data when page becomes visible
        DAKSystem.loadData();
        DAKSystem.renderLetters();
        DAKSystem.renderDashboard();
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    DAKSystem.loadData();
    DAKSystem.renderLetters();
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    DAKComponents.toast.error('An unexpected error occurred');
});

// Prevent accidental page unload when form is being filled
window.addEventListener('beforeunload', (event) => {
    const modal = document.querySelector('.modal:not(.hidden)');
    if (modal) {
        event.preventDefault();
        event.returnValue = '';
    }
});

console.log('✓ dak-app.js loaded successfully');

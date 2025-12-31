/**
 * Utility Functions - Reusable across prototypes
 * Shared utilities for DOM manipulation, formatting, validation, etc.
 */

const Utils = {
    /**
     * DOM Utilities
     */
    dom: {
        get: (id) => document.getElementById(id),
        getAll: (selector) => document.querySelectorAll(selector),
        create: (tag, attributes = {}, content = '') => {
            const element = document.createElement(tag);
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'innerHTML') {
                    element.innerHTML = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
            if (content) element.textContent = content;
            return element;
        },
        show: (element) => {
            if (typeof element === 'string') element = Utils.dom.get(element);
            element?.classList.remove('hidden');
        },
        hide: (element) => {
            if (typeof element === 'string') element = Utils.dom.get(element);
            element?.classList.add('hidden');
        },
        toggle: (element) => {
            if (typeof element === 'string') element = Utils.dom.get(element);
            element?.classList.toggle('hidden');
        },
        on: (element, event, handler, options = {}) => {
            if (typeof element === 'string') element = Utils.dom.get(element);
            element?.addEventListener(event, handler, options);
            return () => element?.removeEventListener(event, handler, options);
        },
        empty: (element) => {
            if (typeof element === 'string') element = Utils.dom.get(element);
            while (element?.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    },

    /**
     * Date/Time Utilities
     */
    date: {
        format: (date, options = {}) => {
            const defaultOptions = {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            };
            return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
        },
        
        formatDateTime: (date) => {
            return new Date(date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        relative: (date) => {
            const now = new Date();
            const diff = now - new Date(date);
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
            if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
            if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            return 'Just now';
        },
        
        isToday: (date) => {
            const today = new Date();
            const checkDate = new Date(date);
            return today.toDateString() === checkDate.toDateString();
        }
    },

    /**
     * String Utilities
     */
    string: {
        capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
        
        titleCase: (str) => {
            return str.replace(/\w\S*/g, (txt) => 
                txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
        },
        
        truncate: (str, length = 50) => {
            return str.length > length ? str.substring(0, length) + '...' : str;
        },
        
        randomId: (prefix = 'id') => {
            return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
        },
        
        slugify: (str) => {
            return str
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
        }
    },

    /**
     * Validation Utilities
     */
    validate: {
        email: (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        
        phone: (phone) => {
            const re = /^\+?[\d\s\-\(\)]{10,}$/;
            return re.test(phone);
        },
        
        required: (value) => {
            return value !== null && value !== undefined && value.toString().trim() !== '';
        },
        
        minLength: (value, min) => {
            return value && value.toString().length >= min;
        },
        
        maxLength: (value, max) => {
            return !value || value.toString().length <= max;
        }
    },

    /**
     * Local Storage Utilities
     */
    storage: {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Error saving to localStorage:', e);
                return false;
            }
        },
        
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Error reading from localStorage:', e);
                return defaultValue;
            }
        },
        
        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Error removing from localStorage:', e);
                return false;
            }
        }
    },

    /**
     * Async Utilities
     */
    async: {
        delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
        
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    },

    /**
     * File Utilities
     */
    file: {
        formatSize: (bytes) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        
        getExtension: (filename) => {
            return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
        },
        
        readAsText: (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsText(file);
            });
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
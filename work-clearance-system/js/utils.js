/**
 * Utility Functions - Reusable across prototypes
 * Common helper functions for DOM manipulation, formatting, validation, etc.
 */

const Utils = {
    /**
     * DOM Utilities
     */
    dom: {
        // Get element by ID
        get: (id) => document.getElementById(id),
        
        // Get elements by selector
        getAll: (selector) => document.querySelectorAll(selector),
        
        // Create element with attributes
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
        
        // Show/hide elements
        show: (element) => {
            if (typeof element === 'string') element = Utils.dom.get(element);
            element?.classList.remove('hidden');
        },
        
        hide: (element) => {
            if (typeof element === 'string') element = Utils.dom.get(element);
            element?.classList.add('hidden');
        },
        
        // Toggle element visibility
        toggle: (element) => {
            if (typeof element === 'string') element = Utils.dom.get(element);
            element?.classList.toggle('hidden');
        },
        
        // Add event listener with cleanup
        on: (element, event, handler, options = {}) => {
            if (typeof element === 'string') element = Utils.dom.get(element);
            element?.addEventListener(event, handler, options);
            return () => element?.removeEventListener(event, handler, options);
        },
        
        // Remove all children from element
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
        // Format date for display
        format: (date, options = {}) => {
            const defaultOptions = {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            };
            return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
        },
        
        // Format date and time
        formatDateTime: (date) => {
            return new Date(date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        // Get relative time (e.g., "2 hours ago")
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
        
        // Check if date is today
        isToday: (date) => {
            const today = new Date();
            const checkDate = new Date(date);
            return today.toDateString() === checkDate.toDateString();
        },
        
        // Add days to date
        addDays: (date, days) => {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }
    },

    /**
     * String Utilities
     */
    string: {
        // Capitalize first letter
        capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
        
        // Convert to title case
        titleCase: (str) => {
            return str.replace(/\w\S*/g, (txt) => 
                txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
        },
        
        // Truncate string with ellipsis
        truncate: (str, length = 50) => {
            return str.length > length ? str.substring(0, length) + '...' : str;
        },
        
        // Generate random ID
        randomId: (prefix = 'id') => {
            return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
        },
        
        // Slugify string (for URLs)
        slugify: (str) => {
            return str
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
        },
        
        // Remove HTML tags
        stripHtml: (str) => {
            const div = document.createElement('div');
            div.innerHTML = str;
            return div.textContent || div.innerText || '';
        }
    },

    /**
     * Number/Currency Utilities
     */
    number: {
        // Format currency
        currency: (amount, currency = 'USD') => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency
            }).format(amount);
        },
        
        // Format number with commas
        format: (num) => {
            return new Intl.NumberFormat('en-US').format(num);
        },
        
        // Generate random number between min and max
        random: (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        
        // Round to decimal places
        round: (num, decimals = 2) => {
            return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
        },
        
        // Convert to percentage
        percentage: (value, total) => {
            return Math.round((value / total) * 100);
        }
    },

    /**
     * Array Utilities
     */
    array: {
        // Remove duplicates
        unique: (arr) => [...new Set(arr)],
        
        // Group array by property
        groupBy: (arr, key) => {
            return arr.reduce((groups, item) => {
                const group = item[key];
                groups[group] = groups[group] || [];
                groups[group].push(item);
                return groups;
            }, {});
        },
        
        // Sort array by property
        sortBy: (arr, key, direction = 'asc') => {
            return [...arr].sort((a, b) => {
                const aVal = a[key];
                const bVal = b[key];
                if (direction === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
        },
        
        // Shuffle array
        shuffle: (arr) => {
            const shuffled = [...arr];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },
        
        // Chunk array into smaller arrays
        chunk: (arr, size) => {
            const chunks = [];
            for (let i = 0; i < arr.length; i += size) {
                chunks.push(arr.slice(i, i + size));
            }
            return chunks;
        }
    },

    /**
     * Validation Utilities
     */
    validate: {
        // Email validation
        email: (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        
        // Phone validation (basic)
        phone: (phone) => {
            const re = /^\+?[\d\s\-\(\)]{10,}$/;
            return re.test(phone);
        },
        
        // Required field validation
        required: (value) => {
            return value !== null && value !== undefined && value.toString().trim() !== '';
        },
        
        // Minimum length validation
        minLength: (value, min) => {
            return value && value.toString().length >= min;
        },
        
        // Maximum length validation
        maxLength: (value, max) => {
            return !value || value.toString().length <= max;
        },
        
        // Number validation
        number: (value) => {
            return !isNaN(value) && !isNaN(parseFloat(value));
        },
        
        // Date validation
        date: (value) => {
            return !isNaN(Date.parse(value));
        }
    },

    /**
     * Local Storage Utilities
     */
    storage: {
        // Set item in localStorage
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Error saving to localStorage:', e);
                return false;
            }
        },
        
        // Get item from localStorage
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Error reading from localStorage:', e);
                return defaultValue;
            }
        },
        
        // Remove item from localStorage
        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Error removing from localStorage:', e);
                return false;
            }
        },
        
        // Clear all localStorage
        clear: () => {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('Error clearing localStorage:', e);
                return false;
            }
        }
    },

    /**
     * URL Utilities
     */
    url: {
        // Get URL parameters
        getParams: () => {
            const params = new URLSearchParams(window.location.search);
            const result = {};
            for (const [key, value] of params) {
                result[key] = value;
            }
            return result;
        },
        
        // Set URL parameter
        setParam: (key, value) => {
            const url = new URL(window.location);
            url.searchParams.set(key, value);
            window.history.pushState({}, '', url);
        },
        
        // Remove URL parameter
        removeParam: (key) => {
            const url = new URL(window.location);
            url.searchParams.delete(key);
            window.history.pushState({}, '', url);
        }
    },

    /**
     * Async Utilities
     */
    async: {
        // Delay execution
        delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
        
        // Retry function with exponential backoff
        retry: async (fn, maxAttempts = 3, delay = 1000) => {
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    return await fn();
                } catch (error) {
                    if (attempt === maxAttempts) throw error;
                    await Utils.async.delay(delay * Math.pow(2, attempt - 1));
                }
            }
        },
        
        // Debounce function
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
        },
        
        // Throttle function
        throttle: (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    },

    /**
     * Color Utilities
     */
    color: {
        // Generate random hex color
        random: () => {
            return '#' + Math.floor(Math.random()*16777215).toString(16);
        },
        
        // Convert hex to RGB
        hexToRgb: (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },
        
        // Get contrasting text color (black or white)
        getContrastText: (hexColor) => {
            const rgb = Utils.color.hexToRgb(hexColor);
            if (!rgb) return '#000000';
            
            const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
            return brightness > 128 ? '#000000' : '#ffffff';
        }
    },

    /**
     * File Utilities
     */
    file: {
        // Format file size
        formatSize: (bytes) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        
        // Get file extension
        getExtension: (filename) => {
            return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
        },
        
        // Read file as text
        readAsText: (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsText(file);
            });
        },
        
        // Download data as file
        download: (data, filename, type = 'text/plain') => {
            const blob = new Blob([data], { type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}


// Log successful loading
console.log('✓ utils.js loaded successfully');
/**
 * Reusable UI Components
 * Common components that can be used across different prototypes
 */

const Components = {
    /**
     * Toast Notification System
     */
    toast: {
        container: null,
        
        init() {
            this.container = Utils.dom.get('toastContainer');
            if (!this.container) {
                this.container = Utils.dom.create('div', {
                    id: 'toastContainer',
                    className: 'fixed top-4 right-4 z-50 space-y-2'
                });
                document.body.appendChild(this.container);
            }
        },
        
        show(message, type = 'info', duration = 5000) {
            if (!this.container) this.init();
            
            const toast = Utils.dom.create('div', {
                className: `toast toast-${type}`
            });
            
            const icon = this.getIcon(type);
            toast.innerHTML = `
                <i class="${icon}"></i>
                <span>${message}</span>
                <button class="toast-close">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Add close functionality
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => this.remove(toast));
            
            this.container.appendChild(toast);
            
            // Auto remove after duration
            if (duration > 0) {
                setTimeout(() => this.remove(toast), duration);
            }
            
            return toast;
        },
        
        remove(toast) {
            if (toast && toast.parentNode) {
                toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }
        },
        
        getIcon(type) {
            const icons = {
                success: 'fas fa-check-circle',
                error: 'fas fa-exclamation-circle',
                warning: 'fas fa-exclamation-triangle',
                info: 'fas fa-info-circle'
            };
            return icons[type] || icons.info;
        },
        
        success(message, duration) {
            return this.show(message, 'success', duration);
        },
        
        error(message, duration) {
            return this.show(message, 'error', duration);
        },
        
        warning(message, duration) {
            return this.show(message, 'warning', duration);
        },
        
        info(message, duration) {
            return this.show(message, 'info', duration);
        }
    },

    /**
     * Modal System
     */
    modal: {
        activeModals: new Set(),
        
        show(modalId, options = {}) {
            const modal = Utils.dom.get(modalId);
            if (!modal) return null;
            
            // Add to active modals
            this.activeModals.add(modalId);
            
            // Show modal
            Utils.dom.show(modal);
            modal.classList.add('fade-in');
            
            // Handle close events
            this.setupCloseHandlers(modal, modalId);
            
            // Handle options
            if (options.title) {
                const titleElement = modal.querySelector('.modal-header h3');
                if (titleElement) titleElement.textContent = options.title;
            }
            
            if (options.content) {
                const bodyElement = modal.querySelector('.modal-body');
                if (bodyElement) bodyElement.innerHTML = options.content;
            }
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            return modal;
        },
        
        hide(modalId) {
            const modal = Utils.dom.get(modalId);
            if (!modal) return;
            
            // Remove from active modals
            this.activeModals.delete(modalId);
            
            // Hide modal
            Utils.dom.hide(modal);
            
            // Restore body scroll if no active modals
            if (this.activeModals.size === 0) {
                document.body.style.overflow = '';
            }
        },
        
        setupCloseHandlers(modal, modalId) {
            // Close button
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.hide(modalId));
            }
            
            // Click outside to close
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hide(modalId);
                }
            });
            
            // Escape key to close
            const escapeHandler = (e) => {
                if (e.key === 'Escape' && this.activeModals.has(modalId)) {
                    this.hide(modalId);
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        },
        
        confirm(message, title = 'Confirm Action') {
            return new Promise((resolve) => {
                const modalId = 'confirmModal';
                let modal = Utils.dom.get(modalId);
                
                if (!modal) {
                    modal = this.createConfirmModal(modalId);
                    document.body.appendChild(modal);
                }
                
                // Set content
                modal.querySelector('.modal-header h3').textContent = title;
                modal.querySelector('.confirm-message').textContent = message;
                
                // Handle buttons
                const confirmBtn = modal.querySelector('.confirm-btn');
                const cancelBtn = modal.querySelector('.cancel-btn');
                
                const handleConfirm = () => {
                    this.hide(modalId);
                    resolve(true);
                    cleanup();
                };
                
                const handleCancel = () => {
                    this.hide(modalId);
                    resolve(false);
                    cleanup();
                };
                
                const cleanup = () => {
                    confirmBtn.removeEventListener('click', handleConfirm);
                    cancelBtn.removeEventListener('click', handleCancel);
                };
                
                confirmBtn.addEventListener('click', handleConfirm);
                cancelBtn.addEventListener('click', handleCancel);
                
                this.show(modalId);
            });
        },
        
        createConfirmModal(modalId) {
            const modal = Utils.dom.create('div', {
                id: modalId,
                className: 'modal hidden'
            });
            
            modal.innerHTML = `
                <div class="modal-content max-w-md">
                    <div class="modal-header">
                        <h3 class="text-xl font-semibold">Confirm Action</h3>
                        <button class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p class="confirm-message text-gray-700"></p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary cancel-btn">Cancel</button>
                        <button class="btn btn-danger confirm-btn">Confirm</button>
                    </div>
                </div>
            `;
            
            return modal;
        }
    },

    /**
     * Loading Spinner
     */
    loading: {
        show(element, text = 'Loading...') {
            if (typeof element === 'string') element = Utils.dom.get(element);
            if (!element) return;
            
            element.classList.add('loading');
            
            // Add loading text if provided
            if (text && !element.querySelector('.loading-text')) {
                const loadingText = Utils.dom.create('div', {
                    className: 'loading-text text-center text-gray-500 mt-4'
                }, text);
                element.appendChild(loadingText);
            }
        },
        
        hide(element) {
            if (typeof element === 'string') element = Utils.dom.get(element);
            if (!element) return;
            
            element.classList.remove('loading');
            
            // Remove loading text
            const loadingText = element.querySelector('.loading-text');
            if (loadingText) {
                loadingText.remove();
            }
        }
    },

    /**
     * Progress Bar
     */
    progress: {
        create(container, options = {}) {
            const { value = 0, max = 100, className = '', showText = true } = options;
            
            if (typeof container === 'string') container = Utils.dom.get(container);
            
            const progressWrapper = Utils.dom.create('div', {
                className: `progress-wrapper ${className}`
            });
            
            const progressBar = Utils.dom.create('div', {
                className: 'progress'
            });
            
            const progressFill = Utils.dom.create('div', {
                className: 'progress-bar',
                style: `width: ${(value / max) * 100}%`
            });
            
            progressBar.appendChild(progressFill);
            progressWrapper.appendChild(progressBar);
            
            if (showText) {
                const progressText = Utils.dom.create('div', {
                    className: 'progress-text text-sm text-gray-600 mt-1 text-center'
                }, `${value}%`);
                progressWrapper.appendChild(progressText);
            }
            
            container.appendChild(progressWrapper);
            
            return {
                update: (newValue) => {
                    const percentage = Math.min(Math.max((newValue / max) * 100, 0), 100);
                    progressFill.style.width = `${percentage}%`;
                    
                    if (showText) {
                        const textElement = progressWrapper.querySelector('.progress-text');
                        if (textElement) textElement.textContent = `${Math.round(percentage)}%`;
                    }
                },
                setType: (type) => {
                    progressFill.className = `progress-bar ${type}`;
                },
                remove: () => {
                    if (progressWrapper.parentNode) {
                        progressWrapper.parentNode.removeChild(progressWrapper);
                    }
                }
            };
        }
    },

    /**
     * Dropdown Component
     */
    dropdown: {
        init(selector) {
            const dropdowns = Utils.dom.getAll(selector || '.dropdown');
            
            dropdowns.forEach(dropdown => {
                const toggle = dropdown.querySelector('.dropdown-toggle');
                const menu = dropdown.querySelector('.dropdown-menu');
                
                if (!toggle || !menu) return;
                
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggle(dropdown);
                });
                
                // Handle item selection
                const items = menu.querySelectorAll('.dropdown-item');
                items.forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.selectItem(dropdown, item);
                        this.close(dropdown);
                    });
                });
            });
            
            // Close dropdowns when clicking outside
            document.addEventListener('click', () => {
                this.closeAll();
            });
        },
        
        toggle(dropdown) {
            if (dropdown.classList.contains('open')) {
                this.close(dropdown);
            } else {
                this.closeAll();
                this.open(dropdown);
            }
        },
        
        open(dropdown) {
            dropdown.classList.add('open');
        },
        
        close(dropdown) {
            dropdown.classList.remove('open');
        },
        
        closeAll() {
            const openDropdowns = Utils.dom.getAll('.dropdown.open');
            openDropdowns.forEach(dropdown => this.close(dropdown));
        },
        
        selectItem(dropdown, item) {
            // Remove active class from all items
            const items = dropdown.querySelectorAll('.dropdown-item');
            items.forEach(i => i.classList.remove('active'));
            
            // Add active class to selected item
            item.classList.add('active');
            
            // Update toggle text
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const toggleText = toggle.querySelector('.dropdown-text');
            if (toggleText) {
                toggleText.textContent = item.textContent;
            }
            
            // Trigger change event
            const changeEvent = new CustomEvent('dropdownChange', {
                detail: {
                    value: item.dataset.value || item.textContent,
                    text: item.textContent,
                    item: item
                }
            });
            dropdown.dispatchEvent(changeEvent);
        }
    },

    /**
     * Tab Component
     */
    tabs: {
        init(selector) {
            const tabContainers = Utils.dom.getAll(selector || '.tabs');
            
            tabContainers.forEach(container => {
                const tabItems = container.querySelectorAll('.tab-item');
                const tabPanes = container.querySelectorAll('.tab-pane');
                
                tabItems.forEach((item, index) => {
                    item.addEventListener('click', () => {
                        this.switchTab(container, index);
                    });
                });
                
                // Activate first tab by default
                if (tabItems.length > 0) {
                    this.switchTab(container, 0);
                }
            });
        },
        
        switchTab(container, index) {
            const tabItems = container.querySelectorAll('.tab-item');
            const tabPanes = container.querySelectorAll('.tab-pane');
            
            // Remove active class from all tabs and panes
            tabItems.forEach(item => item.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to selected tab and pane
            if (tabItems[index]) tabItems[index].classList.add('active');
            if (tabPanes[index]) tabPanes[index].classList.add('active');
            
            // Trigger change event
            const changeEvent = new CustomEvent('tabChange', {
                detail: { index, tab: tabItems[index], pane: tabPanes[index] }
            });
            container.dispatchEvent(changeEvent);
        }
    },

    /**
     * Form Validation
     */
    validation: {
        rules: {
            required: (value) => Utils.validate.required(value),
            email: (value) => !value || Utils.validate.email(value),
            phone: (value) => !value || Utils.validate.phone(value),
            minLength: (value, min) => !value || Utils.validate.minLength(value, min),
            maxLength: (value, max) => Utils.validate.maxLength(value, max),
            number: (value) => !value || Utils.validate.number(value),
            date: (value) => !value || Utils.validate.date(value)
        },
        
        messages: {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            phone: 'Please enter a valid phone number',
            minLength: 'Minimum length is {min} characters',
            maxLength: 'Maximum length is {max} characters',
            number: 'Please enter a valid number',
            date: 'Please enter a valid date'
        },
        
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
        
        validateField(field) {
            const rules = field.dataset.validate.split('|');
            const value = field.value;
            let isValid = true;
            
            // Clear previous errors
            this.clearFieldError(field);
            
            for (const rule of rules) {
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
        
        showFieldError(field, ruleName, params) {
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
        },
        
        clearFieldError(field) {
            const errorElement = field.parentNode.querySelector('.form-error');
            if (errorElement) {
                errorElement.remove();
            }
        },
        
        init(formSelector) {
            const forms = Utils.dom.getAll(formSelector || 'form[data-validate]');
            
            forms.forEach(form => {
                const fields = form.querySelectorAll('[data-validate]');
                
                fields.forEach(field => {
                    field.addEventListener('blur', () => {
                        this.validateField(field);
                    });
                    
                    field.addEventListener('input', Utils.async.debounce(() => {
                        if (field.classList.contains('invalid')) {
                            this.validateField(field);
                        }
                    }, 500));
                });
                
                form.addEventListener('submit', (e) => {
                    if (!this.validateForm(form)) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            });
        }
    },

    /**
     * Data Table Component
     */
    table: {
        create(container, data, columns, options = {}) {
            if (typeof container === 'string') container = Utils.dom.get(container);
            
            const { sortable = true, filterable = false, pagination = false } = options;
            
            const tableWrapper = Utils.dom.create('div', {
                className: 'table-wrapper'
            });
            
            const table = Utils.dom.create('table', {
                className: 'min-w-full divide-y divide-gray-200'
            });
            
            // Create header
            const thead = this.createHeader(columns, sortable);
            table.appendChild(thead);
            
            // Create body
            const tbody = this.createBody(data, columns);
            table.appendChild(tbody);
            
            tableWrapper.appendChild(table);
            container.appendChild(tableWrapper);
            
            return {
                update: (newData) => {
                    const newTbody = this.createBody(newData, columns);
                    table.replaceChild(newTbody, table.querySelector('tbody'));
                },
                sort: (columnKey, direction) => {
                    const sortedData = Utils.array.sortBy(data, columnKey, direction);
                    this.update(sortedData);
                },
                filter: (filterFn) => {
                    const filteredData = data.filter(filterFn);
                    this.update(filteredData);
                }
            };
        },
        
        createHeader(columns, sortable) {
            const thead = Utils.dom.create('thead', {
                className: 'bg-gray-50'
            });
            
            const tr = Utils.dom.create('tr');
            
            columns.forEach(column => {
                const th = Utils.dom.create('th', {
                    className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                });
                
                if (sortable && column.sortable !== false) {
                    th.classList.add('cursor-pointer', 'hover:bg-gray-100');
                    th.innerHTML = `
                        ${column.title}
                        <i class="fas fa-sort ml-1 text-gray-400"></i>
                    `;
                } else {
                    th.textContent = column.title;
                }
                
                tr.appendChild(th);
            });
            
            thead.appendChild(tr);
            return thead;
        },
        
        createBody(data, columns) {
            const tbody = Utils.dom.create('tbody', {
                className: 'bg-white divide-y divide-gray-200'
            });
            
            data.forEach(row => {
                const tr = Utils.dom.create('tr', {
                    className: 'hover:bg-gray-50'
                });
                
                columns.forEach(column => {
                    const td = Utils.dom.create('td', {
                        className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
                    });
                    
                    let cellContent = row[column.key];
                    
                    if (column.render) {
                        cellContent = column.render(cellContent, row);
                    }
                    
                    if (typeof cellContent === 'string') {
                        td.innerHTML = cellContent;
                    } else {
                        td.appendChild(cellContent);
                    }
                    
                    tr.appendChild(td);
                });
                
                tbody.appendChild(tr);
            });
            
            return tbody;
        }
    }
};

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Components.dropdown.init();
    Components.tabs.init();
    Components.validation.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Components;
}


// Log successful loading
console.log('✓ components.js loaded successfully');
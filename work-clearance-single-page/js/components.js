/**
 * Reusable UI Components for Single Page Form
 * Toast notifications, modals, and other interactive components
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
                    className: 'toast-container'
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
            
            this.activeModals.add(modalId);
            Utils.dom.show(modal);
            modal.classList.add('fade-in');
            
            this.setupCloseHandlers(modal, modalId);
            
            if (options.title) {
                const titleElement = modal.querySelector('.modal-header h3');
                if (titleElement) titleElement.textContent = options.title;
            }
            
            if (options.content) {
                const bodyElement = modal.querySelector('.modal-body');
                if (bodyElement) bodyElement.innerHTML = options.content;
            }
            
            document.body.style.overflow = 'hidden';
            return modal;
        },
        
        hide(modalId) {
            const modal = Utils.dom.get(modalId);
            if (!modal) return;
            
            this.activeModals.delete(modalId);
            Utils.dom.hide(modal);
            
            if (this.activeModals.size === 0) {
                document.body.style.overflow = '';
            }
        },
        
        setupCloseHandlers(modal, modalId) {
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.hide(modalId));
            }
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hide(modalId);
                }
            });
            
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
                
                modal.querySelector('.modal-header h3').textContent = title;
                modal.querySelector('.confirm-message').textContent = message;
                
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
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Confirm Action</h3>
                        <button class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p class="confirm-message"></p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary cancel-btn">Cancel</button>
                        <button class="btn btn-primary confirm-btn">Confirm</button>
                    </div>
                </div>
            `;
            
            return modal;
        }
    },

    /**
     * Loading System
     */
    loading: {
        show(element, text = 'Loading...') {
            if (typeof element === 'string') element = Utils.dom.get(element);
            if (!element) return;
            
            element.classList.add('loading');
            
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
            
            const loadingText = element.querySelector('.loading-text');
            if (loadingText) {
                loadingText.remove();
            }
        }
    },

    /**
     * Progress System
     */
    progress: {
        updateOverall(percentage) {
            const progressBar = Utils.dom.get('progressBar');
            const overallProgress = Utils.dom.get('overallProgress');
            
            if (progressBar) {
                progressBar.style.width = `${percentage}%`;
            }
            
            if (overallProgress) {
                overallProgress.style.width = `${percentage}%`;
            }
        },
        
        updateSectionProgress(completedSections, totalSections) {
            const completedElement = Utils.dom.get('completedSections');
            if (completedElement) {
                completedElement.textContent = completedSections;
            }
            
            const percentage = (completedSections / totalSections) * 100;
            this.updateOverall(percentage);
        }
    },

    /**
     * File Upload Component
     */
    fileUpload: {
        init(uploadAreaId, inputId) {
            const uploadArea = Utils.dom.get(uploadAreaId);
            const fileInput = Utils.dom.get(inputId);
            
            if (!uploadArea || !fileInput) return;
            
            // Drag and drop handlers
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });
            
            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                
                const files = Array.from(e.dataTransfer.files);
                this.handleFiles(files);
            });
            
            // Click to upload
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });
            
            // File input change
            fileInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                this.handleFiles(files);
            });
        },
        
        handleFiles(files) {
            const uploadedFilesContainer = Utils.dom.get('uploadedFiles');
            if (!uploadedFilesContainer) return;
            
            files.forEach(file => {
                if (this.validateFile(file)) {
                    this.addFileToList(file, uploadedFilesContainer);
                }
            });
        },
        
        validateFile(file) {
            const maxSize = 10 * 1024 * 1024; // 10MB
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/png'
            ];
            
            if (file.size > maxSize) {
                Components.toast.error(`File "${file.name}" is too large. Maximum size is 10MB.`);
                return false;
            }
            
            if (!allowedTypes.includes(file.type)) {
                Components.toast.error(`File "${file.name}" is not a supported format.`);
                return false;
            }
            
            return true;
        },
        
        addFileToList(file, container) {
            const fileElement = Utils.dom.create('div', {
                className: 'uploaded-file'
            });
            
            fileElement.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file text-blue-500"></i>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size text-gray-500">(${Utils.file.formatSize(file.size)})</span>
                </div>
                <button type="button" class="file-remove">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Add remove functionality
            const removeBtn = fileElement.querySelector('.file-remove');
            removeBtn.addEventListener('click', () => {
                fileElement.remove();
                Components.toast.info(`File "${file.name}" removed.`);
            });
            
            container.appendChild(fileElement);
            Components.toast.success(`File "${file.name}" added successfully.`);
        }
    }
};

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Components.toast.init();
    Components.fileUpload.init('fileUploadArea', 'fileInput');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Components;
}
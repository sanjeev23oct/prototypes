/**
 * Work Clearance System - Core Business Logic
 * Handles work request management, approvals, and notifications
 */

const WorkClearanceSystem = {
    // Current state
    state: {
        workRequests: [],
        filteredRequests: [],
        currentFilters: {
            status: '',
            department: '',
            priority: '',
            search: ''
        },
        currentUser: {
            id: 'admin_001',
            name: 'Admin User',
            role: 'administrator',
            department: 'admin',
            permissions: ['view_all', 'approve_all', 'create_request', 'emergency_stop']
        }
    },

    /**
     * Initialize the system
     */
    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderDashboard();
        this.renderWorkRequests();
        this.renderNotifications();
        this.startRealTimeUpdates();
    },

    /**
     * Load data from storage or generate mock data
     */
    loadData() {
        this.state.workRequests = Utils.storage.get('workRequests') || MockData.generateWorkRequests();
        this.applyFilters();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // New request button
        Utils.dom.on('newRequestBtn', 'click', () => this.showNewRequestModal());
        
        // Filter controls
        Utils.dom.on('statusFilter', 'change', (e) => this.updateFilter('status', e.target.value));
        Utils.dom.on('departmentFilter', 'change', (e) => this.updateFilter('department', e.target.value));
        
        // Quick actions
        Utils.dom.on('viewMapBtn', 'click', () => this.showCampusMap());
        Utils.dom.on('reportsBtn', 'click', () => this.showReports());
        Utils.dom.on('settingsBtn', 'click', () => this.showSettings());
        
        // Notification button
        Utils.dom.on('notificationBtn', 'click', () => this.toggleNotifications());
        
        // Modal close handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    Components.modal.hide(modal.id);
                }
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'n':
                        e.preventDefault();
                        this.showNewRequestModal();
                        break;
                    case 'm':
                        e.preventDefault();
                        this.showCampusMap();
                        break;
                }
            }
        });
    },

    /**
     * Apply current filters to work requests
     */
    applyFilters() {
        let filtered = [...this.state.workRequests];
        
        // Status filter
        if (this.state.currentFilters.status) {
            filtered = filtered.filter(req => req.status === this.state.currentFilters.status);
        }
        
        // Department filter
        if (this.state.currentFilters.department) {
            filtered = filtered.filter(req => req.department === this.state.currentFilters.department);
        }
        
        // Priority filter
        if (this.state.currentFilters.priority) {
            filtered = filtered.filter(req => req.priority === this.state.currentFilters.priority);
        }
        
        // Search filter
        if (this.state.currentFilters.search) {
            const searchTerm = this.state.currentFilters.search.toLowerCase();
            filtered = filtered.filter(req => 
                req.title.toLowerCase().includes(searchTerm) ||
                req.description.toLowerCase().includes(searchTerm) ||
                req.id.toLowerCase().includes(searchTerm) ||
                req.locationName.toLowerCase().includes(searchTerm)
            );
        }
        
        this.state.filteredRequests = filtered;
    },

    /**
     * Update filter and refresh display
     */
    updateFilter(filterType, value) {
        this.state.currentFilters[filterType] = value;
        this.applyFilters();
        this.renderWorkRequests();
    },

    /**
     * Render dashboard statistics
     */
    renderDashboard() {
        const stats = this.calculateStatistics();
        
        // These elements were removed from HTML, so check if they exist
        const pendingCount = Utils.dom.get('pendingCount');
        const activeCount = Utils.dom.get('activeCount');
        const completedCount = Utils.dom.get('completedCount');
        const riskCount = Utils.dom.get('riskCount');
        
        if (pendingCount) pendingCount.textContent = stats.pending;
        if (activeCount) activeCount.textContent = stats.active;
        if (completedCount) completedCount.textContent = stats.completed;
        if (riskCount) riskCount.textContent = stats.risks;
        
        // Update notification badge
        const badge = Utils.dom.get('notificationBadge');
        if (badge) {
            if (stats.notifications > 0) {
                badge.textContent = stats.notifications;
                Utils.dom.show(badge);
            } else {
                Utils.dom.hide(badge);
            }
        }
    },

    /**
     * Calculate dashboard statistics
     */
    calculateStatistics() {
        const requests = this.state.workRequests;
        const today = new Date().toDateString();
        
        return {
            pending: requests.filter(r => r.status === 'pending').length,
            active: requests.filter(r => r.status === 'active').length,
            completed: requests.filter(r => 
                r.status === 'completed' && 
                r.actualEndDate && 
                new Date(r.actualEndDate).toDateString() === today
            ).length,
            risks: requests.filter(r => 
                (r.riskLevel === 'high' || r.priority === 'urgent') && 
                r.status !== 'completed'
            ).length,
            notifications: this.getUnreadNotifications().length
        };
    },

    /**
     * Render work requests table
     */
    renderWorkRequests() {
        const tbody = Utils.dom.get('requestsTableBody');
        Utils.dom.empty(tbody);
        
        this.state.filteredRequests.forEach(request => {
            const row = this.createRequestRow(request);
            tbody.appendChild(row);
        });
    },

    /**
     * Create a table row for a work request
     */
    createRequestRow(request) {
        const row = Utils.dom.create('tr', {
            className: `hover:bg-gray-50 cursor-pointer ${this.getRowClasses(request)}`
        });
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${request.id}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full dept-${request.department} mr-2"></div>
                    ${request.departmentName}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="work-type-${request.workType}">${request.workTypeName}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${request.locationName}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge status-${request.status}">
                    ${Utils.string.titleCase(request.status)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                    <button class="text-blue-600 hover:text-blue-900" onclick="WorkClearanceSystem.viewRequest('${request.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${this.canEditRequest(request) ? `
                        <button class="text-green-600 hover:text-green-900" onclick="WorkClearanceSystem.editRequest('${request.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    ` : ''}
                    ${this.canApproveRequest(request) ? `
                        <button class="text-purple-600 hover:text-purple-900" onclick="WorkClearanceSystem.approveRequest('${request.id}')">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        
        // Add click handler for row
        row.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                this.viewRequest(request.id);
            }
        });
        
        return row;
    },

    /**
     * Get CSS classes for request row based on status and priority
     */
    getRowClasses(request) {
        let classes = [];
        
        if (request.priority === 'urgent') {
            classes.push('border-l-4', 'border-red-500');
        } else if (request.riskLevel === 'high') {
            classes.push('border-l-4', 'border-orange-500');
        }
        
        if (request.status === 'active') {
            classes.push('bg-blue-50');
        }
        
        return classes.join(' ');
    },

    /**
     * Check if user can edit request
     */
    canEditRequest(request) {
        return request.status === 'pending' || 
               this.state.currentUser.permissions.includes('edit_all');
    },

    /**
     * Check if user can approve request
     */
    canApproveRequest(request) {
        // User cannot approve their own request
        if (request.requesterId === this.state.currentUser.id) {
            return false;
        }
        
        // User cannot approve if they are from the requesting department
        if (request.department === this.state.currentUser.department) {
            return false;
        }
        
        // Check if current user's department is in the notify list
        const isInNotifyList = request.notifyDepartments?.some(
            dept => dept.id === this.state.currentUser.department
        );
        
        // User can approve if:
        // 1. Request is pending
        // 2. Their department is in the notification list
        // 3. They haven't already approved
        if (request.status === 'pending' && isInNotifyList) {
            const alreadyApproved = request.notifyDepartments.find(
                dept => dept.id === this.state.currentUser.department
            )?.clearanceReceived;
            
            return !alreadyApproved;
        }
        
        // Admin can approve anything
        return request.status === 'pending' && 
               this.state.currentUser.permissions.includes('approve_all');
    },

    /**
     * Show new request modal
     */
    showNewRequestModal() {
        const modal = Components.modal.show('newRequestModal');
        this.renderNewRequestForm();
    },

    /**
     * Render new request form
     */
    renderNewRequestForm() {
        const form = Utils.dom.get('newRequestForm');
        
        form.innerHTML = `
            <div class="form-wizard">
                <div class="mb-4 flex justify-between items-center">
                    <button type="button" class="btn btn-secondary" onclick="WorkClearanceSystem.loadSampleData(0)">
                        <i class="fas fa-magic"></i> Load Sample Data
                    </button>
                </div>
                
                <ul class="wizard-steps">
                    <li class="wizard-step active">
                        <div class="step-indicator">1</div>
                        <div class="step-title">Work Details</div>
                    </li>
                    <li class="wizard-step">
                        <div class="step-indicator">2</div>
                        <div class="step-title">Coordination</div>
                    </li>
                </ul>
                
                <div class="wizard-content">
                    <!-- Step 1: Work Details & Schedule -->
                    <div class="wizard-pane active" id="step1">
                        <div class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="form-group">
                                    <label class="form-label required">Work Title</label>
                                    <input type="text" class="form-input" name="title" data-validate="required" 
                                           placeholder="Brief description of work">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label required">Requesting Department</label>
                                    <select class="form-select" name="department" data-validate="required">
                                        <option value="">Select Department</option>
                                        ${MockData.departments.map(dept => 
                                            `<option value="${dept.id}">${dept.name}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label required">Work Type</label>
                                    <select class="form-select" name="workType" data-validate="required">
                                        <option value="">Select Work Type</option>
                                        ${MockData.workTypes.map(type => 
                                            `<option value="${type.id}">${type.name}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label required">Location</label>
                                    <select class="form-select" name="location" data-validate="required">
                                        <option value="">Select Location</option>
                                        ${MockData.locations.map(loc => 
                                            `<option value="${loc.id}">${loc.name}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label required">Start Date & Time</label>
                                    <input type="datetime-local" class="form-input" name="startDate" data-validate="required">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label required">End Date & Time</label>
                                    <input type="datetime-local" class="form-input" name="endDate" data-validate="required">
                                </div>
                                
                                <div class="form-group md:col-span-2">
                                    <label class="form-label required">Work Description</label>
                                    <textarea class="form-textarea" name="description" rows="3" data-validate="required|minLength:20"
                                              placeholder="Detailed description of work to be performed"></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Emergency Contact</label>
                                    <input type="tel" class="form-input" name="emergencyContact" 
                                           placeholder="+91-XXXXXXXXXX">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Duration (hours)</label>
                                    <input type="number" class="form-input" name="duration" min="1" max="24" 
                                           placeholder="Estimated hours">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Step 2: Coordination & Risk -->
                    <div class="wizard-pane" id="step2">
                        <div class="space-y-4">
                            <!-- Infrastructure Impact -->
                            <div class="form-group">
                                <label class="form-label">Infrastructure That May Be Affected</label>
                                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    ${MockData.infrastructureTypes.map(infra => `
                                        <label class="flex items-center">
                                            <input type="checkbox" class="form-checkbox" name="infrastructure" value="${infra.id}">
                                            <span class="ml-2 text-sm">${infra.name}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <!-- Department Coordination -->
                            <div class="form-group">
                                <label class="form-label required">Departments to Notify & Seek Clearance From</label>
                                <div class="dept-selection-container">
                                        <div class="flex items-center justify-between mb-3">
                                            <span class="text-sm font-medium text-gray-700">Select all departments that need to provide clearance:</span>
                                            <div class="dept-selection-buttons">
                                                <button type="button" class="btn btn-sm btn-secondary" id="selectAllDepts">
                                                    <i class="fas fa-check-double"></i> Select All
                                                </button>
                                                <button type="button" class="btn btn-sm btn-secondary" id="clearAllDepts">
                                                    <i class="fas fa-times"></i> Clear All
                                                </button>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            ${MockData.departments.map(dept => `
                                                <label class="dept-checkbox-label flex items-center p-3 bg-white rounded-lg border hover:bg-blue-50 cursor-pointer transition">
                                                    <input type="checkbox" class="form-checkbox dept-checkbox" name="notifyDepartments" value="${dept.id}">
                                                    <div class="ml-3 flex-1">
                                                        <div class="flex items-center">
                                                            <div class="w-3 h-3 rounded-full dept-${dept.id} mr-2"></div>
                                                            <span class="text-sm font-medium text-gray-900">${dept.name}</span>
                                                        </div>
                                                        <div class="text-xs text-gray-500 mt-1">
                                                            Head: ${dept.head} | ${dept.contact}
                                                        </div>
                                                    </div>
                                                </label>
                                            `).join('')}
                                        </div>
                                        <div class="dept-info-note">
                                            <div class="flex items-start">
                                                <i class="fas fa-info-circle text-blue-500 mt-0.5 mr-2"></i>
                                                <div class="text-sm text-blue-700">
                                                    <strong>Important:</strong> Selected departments will receive advance notification and must provide clearance before work can begin. 
                                                    Choose all departments whose operations or infrastructure might be affected by this work.
                                                    <br><br>
                                                    <strong>Note:</strong> This is different from your requesting department above - these are the departments you need permission from.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Safety Measures -->
                            <div class="bg-white p-4 rounded-lg border">
                                <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <i class="fas fa-shield-alt text-red-500 mr-2"></i>
                                    Safety Measures
                                </h4>
                                <div class="form-group">
                                    <label class="form-label">Safety Measures & Precautions</label>
                                    <textarea class="form-textarea" name="safetyMeasures" 
                                              placeholder="List safety measures and precautions to be taken"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="wizard-actions">
                    <button type="button" class="btn btn-secondary" id="prevBtn" style="display: none;">
                        <i class="fas fa-arrow-left"></i> Previous
                    </button>
                    <div class="flex space-x-3">
                        <button type="button" class="btn btn-secondary" onclick="Components.modal.hide('newRequestModal')">
                            Cancel
                        </button>
                        <button type="button" class="btn btn-primary" id="nextBtn">
                            Next <i class="fas fa-arrow-right"></i>
                        </button>
                        <button type="submit" class="btn btn-success" id="submitBtn" style="display: none;">
                            <i class="fas fa-paper-plane"></i> Submit Request
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.setupFormWizard();
        this.setupDepartmentSelection();
    },

    /**
     * Setup form wizard navigation
     */
    setupFormWizard() {
        let currentStep = 0;
        const steps = Utils.dom.getAll('.wizard-step');
        const panes = Utils.dom.getAll('.wizard-pane');
        const nextBtn = Utils.dom.get('nextBtn');
        const prevBtn = Utils.dom.get('prevBtn');
        const submitBtn = Utils.dom.get('submitBtn');
        
        const updateStep = () => {
            // Update step indicators
            steps.forEach((step, index) => {
                step.classList.remove('active', 'completed');
                if (index < currentStep) {
                    step.classList.add('completed');
                } else if (index === currentStep) {
                    step.classList.add('active');
                }
            });
            
            // Update panes
            panes.forEach((pane, index) => {
                pane.classList.remove('active');
                if (index === currentStep) {
                    pane.classList.add('active');
                }
            });
            
            // Update buttons
            prevBtn.style.display = currentStep > 0 ? 'block' : 'none';
            nextBtn.style.display = currentStep < steps.length - 1 ? 'block' : 'none';
            submitBtn.style.display = currentStep === steps.length - 1 ? 'block' : 'none';
        };
        
        nextBtn.addEventListener('click', () => {
            if (this.validateCurrentStep(currentStep)) {
                currentStep++;
                updateStep();
            }
        });
        
        prevBtn.addEventListener('click', () => {
            currentStep--;
            updateStep();
        });
        
        // Form submission
        const form = Utils.dom.get('newRequestForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitNewRequest(form);
        });
    },

    /**
     * Setup department selection functionality
     */
    setupDepartmentSelection() {
        const selectAllBtn = Utils.dom.get('selectAllDepts');
        const clearAllBtn = Utils.dom.get('clearAllDepts');
        const deptCheckboxes = Utils.dom.getAll('.dept-checkbox');
        
        // Select All functionality
        selectAllBtn?.addEventListener('click', () => {
            deptCheckboxes.forEach(checkbox => {
                checkbox.checked = true;
                this.updateDepartmentSelection(checkbox, true);
            });
            Components.toast.info('All departments selected for notification');
        });
        
        // Clear All functionality
        clearAllBtn?.addEventListener('click', () => {
            deptCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                this.updateDepartmentSelection(checkbox, false);
            });
            Components.toast.info('All department selections cleared');
        });
        
        // Individual checkbox change handlers
        deptCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateDepartmentSelection(e.target, e.target.checked);
            });
        });
        
        // Update button states based on current selection
        this.updateDepartmentButtons();
    },

    /**
     * Update department selection visual feedback
     */
    updateDepartmentSelection(checkbox, isSelected) {
        const label = checkbox.closest('label');
        if (isSelected) {
            label.classList.add('bg-blue-100', 'border-blue-300', 'selected');
            label.classList.remove('bg-white');
        } else {
            label.classList.remove('bg-blue-100', 'border-blue-300', 'selected');
            label.classList.add('bg-white');
        }
        
        this.updateDepartmentButtons();
        
        // Clear validation error if any departments are selected
        const deptCheckboxes = Utils.dom.getAll('.dept-checkbox');
        const checkedCount = Array.from(deptCheckboxes).filter(cb => cb.checked).length;
        
        if (checkedCount > 0) {
            const container = document.querySelector('.dept-selection-container');
            if (container) {
                container.classList.remove('has-error');
                const errorElement = container.querySelector('.dept-selection-error');
                if (errorElement) {
                    errorElement.remove();
                }
            }
        }
    },

    /**
     * Update Select All/Clear All button states
     */
    updateDepartmentButtons() {
        const deptCheckboxes = Utils.dom.getAll('.dept-checkbox');
        const checkedCount = Array.from(deptCheckboxes).filter(cb => cb.checked).length;
        const totalCount = deptCheckboxes.length;
        
        const selectAllBtn = Utils.dom.get('selectAllDepts');
        const clearAllBtn = Utils.dom.get('clearAllDepts');
        
        if (selectAllBtn && clearAllBtn) {
            // Update button text and states
            if (checkedCount === 0) {
                selectAllBtn.innerHTML = '<i class="fas fa-check-double"></i> Select All';
                selectAllBtn.disabled = false;
                clearAllBtn.disabled = true;
            } else if (checkedCount === totalCount) {
                selectAllBtn.innerHTML = '<i class="fas fa-check-double"></i> All Selected';
                selectAllBtn.disabled = true;
                clearAllBtn.disabled = false;
            } else {
                selectAllBtn.innerHTML = `<i class="fas fa-check-double"></i> Select All (${checkedCount}/${totalCount})`;
                selectAllBtn.disabled = false;
                clearAllBtn.disabled = false;
            }
        }
    },

    /**
     * Validate current step of the form
     */
    validateCurrentStep(step) {
        const currentPane = Utils.dom.get(`step${step + 1}`);
        const fields = currentPane.querySelectorAll('[data-validate]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!Components.validation.validateField(field)) {
                isValid = false;
            }
        });
        
        // Special validation for department selection in step 2
        if (step === 1) { // Step 2 (0-indexed)
            const deptCheckboxes = currentPane.querySelectorAll('.dept-checkbox');
            const checkedDepts = Array.from(deptCheckboxes).filter(cb => cb.checked);
            
            if (checkedDepts.length === 0) {
                // Show error message
                const container = currentPane.querySelector('.dept-selection-container');
                container.classList.add('has-error');
                
                let errorElement = container.querySelector('.dept-selection-error');
                if (!errorElement) {
                    errorElement = Utils.dom.create('div', {
                        className: 'dept-selection-error'
                    }, 'Please select at least one department to notify and seek clearance from.');
                    container.appendChild(errorElement);
                }
                
                isValid = false;
            } else {
                // Remove error message
                const container = currentPane.querySelector('.dept-selection-container');
                container.classList.remove('has-error');
                const errorElement = container.querySelector('.dept-selection-error');
                if (errorElement) {
                    errorElement.remove();
                }
            }
        }
        
        return isValid;
    },

    /**
     * Submit new work request
     */
    async submitNewRequest(form) {
        Components.loading.show(form);
        
        try {
            // Simulate API call
            await Utils.async.delay(1500);
            
            const formData = new FormData(form);
            const requestData = this.processFormData(formData);
            
            // Add to requests
            this.state.workRequests.unshift(requestData);
            Utils.storage.set('workRequests', this.state.workRequests);
            
            // Update display
            this.applyFilters();
            this.renderDashboard();
            this.renderWorkRequests();
            
            // Show success message
            Components.toast.success('Work request submitted successfully!');
            Components.modal.hide('newRequestModal');
            
        } catch (error) {
            Components.toast.error('Failed to submit request. Please try again.');
        } finally {
            Components.loading.hide(form);
        }
    },

    /**
     * Process form data into request object
     */
    processFormData(formData) {
        const id = `WR-${String(this.state.workRequests.length + 1).padStart(4, '0')}`;
        const now = new Date().toISOString();
        
        // Get selected infrastructure
        const infrastructure = [];
        formData.getAll('infrastructure').forEach(infra => {
            infrastructure.push(infra);
        });
        
        // Get selected departments for notification
        const notifyDepartments = [];
        formData.getAll('notifyDepartments').forEach(deptId => {
            const dept = MockData.departments.find(d => d.id === deptId);
            if (dept) {
                notifyDepartments.push({
                    id: deptId,
                    name: dept.name,
                    head: dept.head,
                    contact: dept.contact,
                    notificationSent: false,
                    clearanceReceived: false,
                    clearanceDate: null,
                    comments: ''
                });
            }
        });
        
        // Get work type details
        const workType = MockData.workTypes.find(t => t.id === formData.get('workType'));
        
        return {
            id: id,
            requesterId: this.state.currentUser.id,
            requesterName: this.state.currentUser.name,
            department: formData.get('department'),
            departmentName: MockData.departments.find(d => d.id === formData.get('department'))?.name || '',
            workType: formData.get('workType'),
            workTypeName: workType?.name || '',
            title: formData.get('title'),
            description: formData.get('description'),
            location: formData.get('location'),
            locationName: MockData.locations.find(l => l.id === formData.get('location'))?.name || '',
            status: 'pending',
            priority: formData.get('priority'),
            riskLevel: workType?.riskLevel || 'medium',
            estimatedDuration: parseInt(formData.get('duration')) || 1,
            plannedStartDate: formData.get('startDate'),
            plannedEndDate: formData.get('endDate'),
            actualStartDate: null,
            actualEndDate: null,
            createdAt: now,
            updatedAt: now,
            infrastructureAffected: infrastructure,
            notifyDepartments: notifyDepartments,
            approvalChain: MockData.generateApprovalChain(workType?.requiresApproval || ['supervisor']),
            notifications: [],
            attachments: [],
            comments: [],
            emergencyContact: formData.get('emergencyContact') || '',
            safetyMeasures: MockData.generateSafetyMeasures(workType?.riskLevel || 'medium')
        };
    },

    /**
     * View request details
     */
    viewRequest(requestId) {
        const request = this.state.workRequests.find(r => r.id === requestId);
        if (!request) return;
        
        const modal = Components.modal.show('requestDetailsModal');
        this.renderRequestDetails(request);
    },

    /**
     * Render request details in modal
     */
    renderRequestDetails(request) {
        const content = Utils.dom.get('requestDetailsContent');
        
        content.innerHTML = `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-900">${request.title}</h4>
                        <p class="text-sm text-gray-500">Request ID: ${request.id}</p>
                    </div>
                    <div class="flex space-x-2">
                        <span class="badge status-${request.status}">${Utils.string.titleCase(request.status)}</span>
                        <span class="badge priority-${request.priority}">${Utils.string.titleCase(request.priority)}</span>
                    </div>
                </div>
                
                <!-- Tabs -->
                <div class="tabs">
                    <ul class="tab-list">
                        <li class="tab-item active">Details</li>
                        <li class="tab-item">Timeline</li>
                        <li class="tab-item">Approvals</li>
                        <li class="tab-item">Safety</li>
                    </ul>
                    
                    <div class="tab-content">
                        <!-- Details Tab -->
                        <div class="tab-pane active">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="text-sm font-medium text-gray-700">Department</label>
                                    <p class="text-sm text-gray-900">${request.departmentName}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700">Work Type</label>
                                    <p class="text-sm text-gray-900">${request.workTypeName}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700">Location</label>
                                    <p class="text-sm text-gray-900">${request.locationName}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700">Risk Level</label>
                                    <p class="text-sm text-gray-900">${Utils.string.titleCase(request.riskLevel)}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700">Planned Start</label>
                                    <p class="text-sm text-gray-900">${Utils.date.formatDateTime(request.plannedStartDate)}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700">Planned End</label>
                                    <p class="text-sm text-gray-900">${Utils.date.formatDateTime(request.plannedEndDate)}</p>
                                </div>
                                <div class="md:col-span-2">
                                    <label class="text-sm font-medium text-gray-700">Description</label>
                                    <p class="text-sm text-gray-900 mt-1">${request.description}</p>
                                </div>
                                ${request.infrastructureAffected.length > 0 ? `
                                    <div class="md:col-span-2">
                                        <label class="text-sm font-medium text-gray-700">Infrastructure Affected</label>
                                        <div class="flex flex-wrap gap-2 mt-1">
                                            ${request.infrastructureAffected.map(infraId => {
                                                const infra = MockData.infrastructureTypes.find(i => i.id === infraId);
                                                return `<span class="badge infra-${infraId}">${infra?.name || infraId}</span>`;
                                            }).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                ${request.notifyDepartments && request.notifyDepartments.length > 0 ? `
                                    <div class="md:col-span-2">
                                        <label class="text-sm font-medium text-gray-700">Departments Notified</label>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                            ${request.notifyDepartments.map(dept => `
                                                <div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                    <div class="flex items-center">
                                                        <div class="w-3 h-3 rounded-full dept-${dept.id} mr-2"></div>
                                                        <div>
                                                            <div class="text-sm font-medium">${dept.name}</div>
                                                            <div class="text-xs text-gray-500">${dept.head}</div>
                                                        </div>
                                                    </div>
                                                    <div class="flex items-center space-x-2">
                                                        ${dept.clearanceReceived ? 
                                                            '<span class="badge badge-success">Cleared</span>' : 
                                                            '<span class="badge badge-warning">Pending</span>'
                                                        }
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- Timeline Tab -->
                        <div class="tab-pane">
                            <div class="timeline">
                                <div class="timeline-item">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <h5 class="font-medium">Request Created</h5>
                                            <p class="text-sm text-gray-600">by ${request.requesterName}</p>
                                        </div>
                                        <span class="text-sm text-gray-500">${Utils.date.formatDateTime(request.createdAt)}</span>
                                    </div>
                                </div>
                                ${request.comments.map(comment => `
                                    <div class="timeline-item">
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <h5 class="font-medium">Comment Added</h5>
                                                <p class="text-sm text-gray-600">${comment.text}</p>
                                                <p class="text-xs text-gray-500">by ${comment.author}</p>
                                            </div>
                                            <span class="text-sm text-gray-500">${Utils.date.formatDateTime(comment.createdAt)}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Approvals Tab -->
                        <div class="tab-pane">
                            <div class="approval-chain">
                                ${request.approvalChain.map((approval, index) => `
                                    <div class="approver ${approval.status}">
                                        <img class="approver-avatar" src="https://ui-avatars.com/api/?name=${encodeURIComponent(approval.approverName)}&background=3b82f6&color=fff" alt="${approval.approverName}">
                                        <div class="approver-name">${approval.approverName}</div>
                                        <div class="approver-role">${approval.approverRole}</div>
                                        ${approval.status === 'approved' ? `<div class="text-xs text-green-600 mt-1">✓ Approved</div>` : ''}
                                        ${approval.status === 'rejected' ? `<div class="text-xs text-red-600 mt-1">✗ Rejected</div>` : ''}
                                        ${approval.status === 'pending' ? `<div class="text-xs text-yellow-600 mt-1">⏳ Pending</div>` : ''}
                                    </div>
                                    ${index < request.approvalChain.length - 1 ? '<div class="approval-arrow">→</div>' : ''}
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Safety Tab -->
                        <div class="tab-pane">
                            <div class="space-y-4">
                                <div>
                                    <h5 class="font-medium text-gray-900 mb-2">Safety Measures</h5>
                                    <ul class="list-disc list-inside space-y-1">
                                        ${request.safetyMeasures.map(measure => 
                                            `<li class="text-sm text-gray-700">${measure}</li>`
                                        ).join('')}
                                    </ul>
                                </div>
                                ${request.emergencyContact ? `
                                    <div>
                                        <h5 class="font-medium text-gray-900 mb-2">Emergency Contact</h5>
                                        <p class="text-sm text-gray-700">${request.emergencyContact}</p>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="flex justify-end space-x-3 pt-4 border-t">
                    ${this.canApproveRequest(request) ? `
                        <button class="btn btn-success" onclick="WorkClearanceSystem.approveRequest('${request.id}')">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn btn-danger" onclick="WorkClearanceSystem.rejectRequest('${request.id}')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    ` : ''}
                    ${this.canEditRequest(request) ? `
                        <button class="btn btn-primary" onclick="WorkClearanceSystem.editRequest('${request.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    ` : ''}
                    <button class="btn btn-secondary" onclick="Components.modal.hide('requestDetailsModal')">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        // Initialize tabs
        Components.tabs.init(content);
    },

    /**
     * Approve a request
     */
    async approveRequest(requestId) {
        const request = this.state.workRequests.find(r => r.id === requestId);
        if (!request) return;
        
        const confirmed = await Components.modal.confirm(
            `Approve clearance for "${request.title}"?\n\nYour department: ${this.state.currentUser.department.toUpperCase()}`,
            'Approve Clearance'
        );
        
        if (!confirmed) return;
        
        // Find the department in notify list and mark as approved
        const deptToApprove = request.notifyDepartments.find(
            dept => dept.id === this.state.currentUser.department
        );
        
        if (deptToApprove) {
            deptToApprove.clearanceReceived = true;
            deptToApprove.clearanceDate = new Date().toISOString();
            deptToApprove.comments = `Approved by ${this.state.currentUser.name}`;
            deptToApprove.notificationSent = true;
        }
        
        // Check if all departments have approved
        const allApproved = request.notifyDepartments.every(dept => dept.clearanceReceived);
        
        if (allApproved) {
            request.status = 'approved';
            Components.toast.success('All departments approved! Request is now APPROVED.');
        } else {
            const remaining = request.notifyDepartments.filter(d => !d.clearanceReceived).length;
            Components.toast.success(`Your clearance recorded. ${remaining} department(s) pending.`);
        }
        
        request.updatedAt = new Date().toISOString();
        
        // Save changes
        Utils.storage.set('workRequests', this.state.workRequests);
        
        // Update display
        this.applyFilters();
        this.renderDashboard();
        this.renderWorkRequests();
        
        // Close modal if open
        Components.modal.hide('requestDetailsModal');
    },

    /**
     * Reject a request
     */
    async rejectRequest(requestId) {
        const confirmed = await Components.modal.confirm(
            'Are you sure you want to reject this work request?',
            'Reject Request'
        );
        
        if (!confirmed) return;
        
        const request = this.state.workRequests.find(r => r.id === requestId);
        if (!request) return;
        
        // Update request status
        request.status = 'rejected';
        request.updatedAt = new Date().toISOString();
        
        // Update approval chain
        const pendingApproval = request.approvalChain.find(a => a.status === 'pending');
        if (pendingApproval) {
            pendingApproval.status = 'rejected';
            pendingApproval.approvedAt = new Date().toISOString();
            pendingApproval.comments = 'Rejected - additional information required';
        }
        
        // Save changes
        Utils.storage.set('workRequests', this.state.workRequests);
        
        // Update display
        this.applyFilters();
        this.renderDashboard();
        this.renderWorkRequests();
        
        // Show success message
        Components.toast.warning('Request rejected.');
        Components.modal.hide('requestDetailsModal');
    },

    /**
     * Edit a request
     */
    editRequest(requestId) {
        Components.toast.info('Edit functionality will be implemented in the next iteration.');
    },

    /**
     * Show campus map
     */
    showCampusMap() {
        Components.toast.info('Campus map integration will be implemented in the next iteration.');
    },

    /**
     * Show reports
     */
    showReports() {
        Components.toast.info('Reports functionality will be implemented in the next iteration.');
    },

    /**
     * Show settings
     */
    showSettings() {
        Components.toast.info('Settings panel will be implemented in the next iteration.');
    },

    /**
     * Toggle notifications panel
     */
    toggleNotifications() {
        Components.toast.info('Notifications panel will be implemented in the next iteration.');
    },

    /**
     * Render notifications
     */
    renderNotifications() {
        const container = Utils.dom.get('notificationsList');
        const notifications = this.getRecentNotifications();
        
        Utils.dom.empty(container);
        
        notifications.forEach(notification => {
            const item = Utils.dom.create('div', {
                className: `notification-item ${notification.read ? '' : 'unread'} ${notification.type}`
            });
            
            item.innerHTML = `
                <div class="flex items-start space-x-3">
                    <i class="${this.getNotificationIcon(notification.type)} text-lg"></i>
                    <div class="flex-1">
                        <h5 class="font-medium text-sm">${notification.title}</h5>
                        <p class="text-xs text-gray-600 mt-1">${notification.message}</p>
                        <span class="text-xs text-gray-500">${Utils.date.relative(notification.createdAt)}</span>
                    </div>
                </div>
            `;
            
            container.appendChild(item);
        });
    },

    /**
     * Get notification icon based on type
     */
    getNotificationIcon(type) {
        const icons = {
            info: 'fas fa-info-circle text-blue-500',
            warning: 'fas fa-exclamation-triangle text-yellow-500',
            success: 'fas fa-check-circle text-green-500',
            error: 'fas fa-exclamation-circle text-red-500'
        };
        return icons[type] || icons.info;
    },

    /**
     * Get recent notifications
     */
    getRecentNotifications() {
        const allNotifications = [];
        
        this.state.workRequests.forEach(request => {
            request.notifications.forEach(notification => {
                allNotifications.push({
                    ...notification,
                    requestId: request.id
                });
            });
        });
        
        return allNotifications
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
    },

    /**
     * Get unread notifications
     */
    getUnreadNotifications() {
        return this.getRecentNotifications().filter(n => !n.read);
    },

    /**
     * Start real-time updates simulation
     */
    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            // Randomly update some request statuses
            const activeRequests = this.state.workRequests.filter(r => r.status === 'active');
            if (activeRequests.length > 0 && Math.random() > 0.8) {
                const randomRequest = activeRequests[Math.floor(Math.random() * activeRequests.length)];
                randomRequest.status = 'completed';
                randomRequest.actualEndDate = new Date().toISOString();
                randomRequest.updatedAt = new Date().toISOString();
                
                Utils.storage.set('workRequests', this.state.workRequests);
                this.applyFilters();
                this.renderDashboard();
                this.renderWorkRequests();
                
                Components.toast.success(`Work ${randomRequest.id} has been completed!`);
            }
        }, 30000);
    },

    /**
     * Impersonate a department user (for demo/testing)
     */
    impersonateUser(userId) {
        const user = MockData.getDepartmentUser(userId);
        if (!user) {
            Components.toast.error('User not found');
            return;
        }
        
        this.state.currentUser = {
            id: user.id,
            name: user.name,
            role: user.role,
            department: user.department,
            permissions: user.permissions
        };
        
        this.updateUserDisplay();
        Components.toast.info(`🎭 Now impersonating: ${user.avatar} ${user.name} (${user.role})`);
        
        // Update active button styling
        document.querySelectorAll('.impersonation-btn').forEach(btn => btn.classList.remove('active'));
        const clickedBtn = document.querySelector(`button[onclick*="${userId}"]`);
        if (clickedBtn) {
            clickedBtn.classList.add('active');
        }
        
        this.renderDashboard();
        this.renderWorkRequests();
    },

    /**
     * Update user display in header
     */
    updateUserDisplay() {
        const user = this.state.currentUser;
        const userDisplay = Utils.dom.get('currentUserDisplay');
        if (userDisplay) {
            const departmentUser = MockData.getDepartmentUser(user.id);
            const avatar = departmentUser ? departmentUser.avatar : '👨‍💼';
            userDisplay.textContent = `${avatar} ${user.name}`;
        }
        const headerUserName = document.querySelector('header .text-sm.font-medium');
        if (headerUserName) {
            headerUserName.textContent = user.name;
        }
    },

    /**
     * Load sample data into form (for quick testing)
     */
    loadSampleData(sampleIndex = 0) {
        const sampleData = MockData.getSampleRequest(sampleIndex);
        
        // Populate form fields
        const form = Utils.dom.get('newRequestForm');
        if (!form) return;
        
        // Basic info
        const titleInput = form.querySelector('[name="title"]');
        if (titleInput) titleInput.value = sampleData.title;
        
        const deptSelect = form.querySelector('[name="department"]');
        if (deptSelect) deptSelect.value = sampleData.department;
        
        const workTypeSelect = form.querySelector('[name="workType"]');
        if (workTypeSelect) workTypeSelect.value = sampleData.workType;
        
        const prioritySelect = form.querySelector('[name="priority"]');
        if (prioritySelect) prioritySelect.value = sampleData.priority;
        
        const descTextarea = form.querySelector('[name="description"]');
        if (descTextarea) descTextarea.value = sampleData.description;
        
        // Location & duration
        const locationSelect = form.querySelector('[name="location"]');
        if (locationSelect) locationSelect.value = sampleData.location;
        
        const startDateInput = form.querySelector('[name="startDate"]');
        if (startDateInput) startDateInput.value = sampleData.startDate;
        
        const endDateInput = form.querySelector('[name="endDate"]');
        if (endDateInput) endDateInput.value = sampleData.endDate;
        
        const durationInput = form.querySelector('[name="duration"]');
        if (durationInput) durationInput.value = sampleData.duration;
        
        // Infrastructure affected
        if (sampleData.infrastructureAffected) {
            sampleData.infrastructureAffected.forEach(infraId => {
                const checkbox = form.querySelector(`[name="infrastructure"][value="${infraId}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        // Notify departments
        if (sampleData.notifyDepartments) {
            sampleData.notifyDepartments.forEach(deptId => {
                const checkbox = form.querySelector(`[name="notifyDepartments"][value="${deptId}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        // Safety measures
        const safetyTextarea = form.querySelector('[name="safetyMeasures"]');
        if (safetyTextarea) safetyTextarea.value = sampleData.safetyMeasures;
        
        // Emergency contact
        const emergencyInput = form.querySelector('[name="emergencyContact"]');
        if (emergencyInput) emergencyInput.value = sampleData.emergencyContact;
        
        // Requester name
        const requesterInput = form.querySelector('[name="requesterName"]');
        if (requesterInput) requesterInput.value = sampleData.requesterName;
        
        // Notes
        const notesTextarea = form.querySelector('[name="notes"]');
        if (notesTextarea) notesTextarea.value = sampleData.notes;
        
        Components.toast.success('Sample data loaded successfully!');
    }
};

// Make globally available
window.WorkClearanceSystem = WorkClearanceSystem;
window.impersonateUser = (userId) => WorkClearanceSystem.impersonateUser(userId);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkClearanceSystem;
}
/**
 * Form Handler - Manages form interactions and data processing
 * Handles form population, validation, submission, and user interactions
 */

const FormHandler = {
    // Form state
    state: {
        selectedPriority: null,
        selectedDepartments: new Set(),
        selectedInfrastructure: new Set(),
        completedSections: new Set(),
        formData: {}
    },

    /**
     * Initialize form handler
     */
    init() {
        this.populateFormOptions();
        this.setupEventListeners();
        this.updateProgress();
    },

    /**
     * Populate form dropdowns and options
     */
    populateFormOptions() {
        // Populate departments
        const departmentSelect = Utils.dom.get('singlePageForm').querySelector('select[name="department"]');
        MockData.departments.forEach(dept => {
            const option = Utils.dom.create('option', { value: dept.id }, dept.name);
            departmentSelect.appendChild(option);
        });

        // Populate work types
        const workTypeSelect = Utils.dom.get('singlePageForm').querySelector('select[name="workType"]');
        MockData.workTypes.forEach(type => {
            const option = Utils.dom.create('option', { value: type.id }, type.name);
            workTypeSelect.appendChild(option);
        });

        // Populate locations
        const locationSelect = Utils.dom.get('singlePageForm').querySelector('select[name="location"]');
        MockData.locations.forEach(location => {
            const option = Utils.dom.create('option', { value: location.id }, location.name);
            locationSelect.appendChild(option);
        });

        // Create priority selector
        this.createPrioritySelector();
        
        // Create infrastructure grid
        this.createInfrastructureGrid();
        
        // Create department grid
        this.createDepartmentGrid();
    },

    /**
     * Create priority selector
     */
    createPrioritySelector() {
        const container = Utils.dom.get('prioritySelector');
        Utils.dom.empty(container);

        MockData.priorities.forEach(priority => {
            const option = Utils.dom.create('div', {
                className: 'priority-option',
                'data-priority': priority.id
            });

            option.innerHTML = `
                <div class="priority-icon">
                    <i class="${priority.icon}" style="color: ${priority.color}"></i>
                </div>
                <div class="priority-label">${priority.name}</div>
                <div class="priority-desc">${priority.description}</div>
            `;

            option.addEventListener('click', () => this.selectPriority(priority.id));
            container.appendChild(option);
        });
    },

    /**
     * Create infrastructure grid
     */
    createInfrastructureGrid() {
        const container = Utils.dom.get('infrastructureGrid');
        Utils.dom.empty(container);

        MockData.infrastructureTypes.forEach(infra => {
            const option = Utils.dom.create('div', {
                className: 'infrastructure-option',
                'data-infrastructure': infra.id
            });

            option.innerHTML = `
                <input type="checkbox" class="form-checkbox" value="${infra.id}">
                <span>${infra.name}</span>
                ${infra.critical ? '<i class="fas fa-exclamation-triangle text-red-500 ml-1" title="Critical Infrastructure"></i>' : ''}
            `;

            const checkbox = option.querySelector('input');
            checkbox.addEventListener('change', (e) => {
                this.toggleInfrastructure(infra.id, e.target.checked);
            });

            container.appendChild(option);
        });
    },

    /**
     * Create department grid
     */
    createDepartmentGrid() {
        const container = Utils.dom.get('departmentGrid');
        Utils.dom.empty(container);

        MockData.departments.forEach(dept => {
            const option = Utils.dom.create('div', {
                className: 'department-option',
                'data-department': dept.id
            });

            option.innerHTML = `
                <input type="checkbox" class="form-checkbox" value="${dept.id}">
                <div class="department-info">
                    <div class="department-name">${dept.name}</div>
                    <div class="department-details">Head: ${dept.head} | ${dept.contact}</div>
                </div>
            `;

            const checkbox = option.querySelector('input');
            checkbox.addEventListener('change', (e) => {
                this.toggleDepartment(dept.id, e.target.checked);
            });

            container.appendChild(option);
        });
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const form = Utils.dom.get('singlePageForm');
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Input change listeners for validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.validateSection(this.getSectionForElement(input));
                this.updateProgress();
            });

            input.addEventListener('input', Utils.async.debounce(() => {
                this.validateSection(this.getSectionForElement(input));
                this.updateProgress();
            }, 500));
        });
    },

    /**
     * Select priority
     */
    selectPriority(priorityId) {
        // Remove previous selection
        Utils.dom.getAll('.priority-option.selected').forEach(option => {
            option.classList.remove('selected');
        });

        // Add new selection
        const option = Utils.dom.get('prioritySelector').querySelector(`[data-priority="${priorityId}"]`);
        option.classList.add('selected');

        // Update hidden input
        const hiddenInput = Utils.dom.get('singlePageForm').querySelector('input[name="priority"]');
        hiddenInput.value = priorityId;

        this.state.selectedPriority = priorityId;
        this.validateSection('basic');
        this.updateProgress();
    },

    /**
     * Toggle infrastructure selection
     */
    toggleInfrastructure(infraId, selected) {
        const option = Utils.dom.get('infrastructureGrid').querySelector(`[data-infrastructure="${infraId}"]`);
        
        if (selected) {
            this.state.selectedInfrastructure.add(infraId);
            option.classList.add('selected');
        } else {
            this.state.selectedInfrastructure.delete(infraId);
            option.classList.remove('selected');
        }

        this.validateSection('infrastructure');
        this.updateProgress();
    },

    /**
     * Toggle department selection
     */
    toggleDepartment(deptId, selected) {
        const option = Utils.dom.get('departmentGrid').querySelector(`[data-department="${deptId}"]`);
        
        if (selected) {
            this.state.selectedDepartments.add(deptId);
            option.classList.add('selected');
        } else {
            this.state.selectedDepartments.delete(deptId);
            option.classList.remove('selected');
        }

        this.validateSection('departments');
        this.updateProgress();
    },

    /**
     * Get section for form element
     */
    getSectionForElement(element) {
        const section = element.closest('.form-section');
        return section ? section.dataset.section : null;
    },

    /**
     * Validate section
     */
    validateSection(sectionName) {
        if (!sectionName) return false;

        const section = Utils.dom.get('singlePageForm').querySelector(`[data-section="${sectionName}"]`);
        if (!section) return false;

        let isValid = true;
        const errors = [];

        switch (sectionName) {
            case 'basic':
                isValid = this.validateBasicSection(section, errors);
                break;
            case 'schedule':
                isValid = this.validateScheduleSection(section, errors);
                break;
            case 'infrastructure':
                isValid = this.validateInfrastructureSection(section, errors);
                break;
            case 'departments':
                isValid = this.validateDepartmentsSection(section, errors);
                break;
            case 'contact':
                isValid = this.validateContactSection(section, errors);
                break;
        }

        // Update section UI
        this.updateSectionUI(section, isValid, errors);

        // Update completed sections
        if (isValid) {
            this.state.completedSections.add(sectionName);
        } else {
            this.state.completedSections.delete(sectionName);
        }

        return isValid;
    },

    /**
     * Validate basic section
     */
    validateBasicSection(section, errors) {
        const title = section.querySelector('input[name="title"]').value.trim();
        const department = section.querySelector('select[name="department"]').value;
        const workType = section.querySelector('select[name="workType"]').value;
        const priority = this.state.selectedPriority;
        const location = section.querySelector('select[name="location"]').value;
        const description = section.querySelector('textarea[name="description"]').value.trim();

        if (!title) errors.push('Work title is required');
        if (!department) errors.push('Department is required');
        if (!workType) errors.push('Work type is required');
        if (!priority) errors.push('Priority is required');
        if (!location) errors.push('Location is required');
        if (!description || description.length < 20) errors.push('Description must be at least 20 characters');

        return errors.length === 0;
    },

    /**
     * Validate schedule section
     */
    validateScheduleSection(section, errors) {
        const startDate = section.querySelector('input[name="startDate"]').value;
        const endDate = section.querySelector('input[name="endDate"]').value;

        if (!startDate) errors.push('Start date is required');
        if (!endDate) errors.push('End date is required');

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const now = new Date();

            if (start < now) errors.push('Start date cannot be in the past');
            if (end <= start) errors.push('End date must be after start date');
        }

        return errors.length === 0;
    },

    /**
     * Validate infrastructure section
     */
    validateInfrastructureSection(section, errors) {
        // Infrastructure selection is optional, so always valid
        return true;
    },

    /**
     * Validate departments section
     */
    validateDepartmentsSection(section, errors) {
        if (this.state.selectedDepartments.size === 0) {
            errors.push('At least one department must be selected for notification');
        }

        return errors.length === 0;
    },

    /**
     * Validate contact section
     */
    validateContactSection(section, errors) {
        const emergencyContact = section.querySelector('input[name="emergencyContact"]').value.trim();
        
        if (emergencyContact && !Utils.validate.phone(emergencyContact)) {
            errors.push('Invalid emergency contact number');
        }

        return errors.length === 0;
    },

    /**
     * Update section UI based on validation
     */
    updateSectionUI(section, isValid, errors) {
        const progressCircle = section.querySelector('.progress-circle');
        const checkIcon = progressCircle.querySelector('.fas.fa-check');

        // Remove existing classes
        section.classList.remove('completed', 'has-errors');
        progressCircle.classList.remove('completed', 'has-errors');

        if (isValid) {
            section.classList.add('completed');
            progressCircle.classList.add('completed');
            Utils.dom.show(checkIcon);
        } else if (errors.length > 0) {
            section.classList.add('has-errors');
            progressCircle.classList.add('has-errors');
            Utils.dom.hide(checkIcon);
        } else {
            Utils.dom.hide(checkIcon);
        }

        // Show/hide errors (could be enhanced with error display)
        if (errors.length > 0 && this.shouldShowErrors(section)) {
            console.log(`Section ${section.dataset.section} errors:`, errors);
        }
    },

    /**
     * Check if errors should be shown for section
     */
    shouldShowErrors(section) {
        // Only show errors if user has interacted with the section
        const inputs = section.querySelectorAll('input, select, textarea');
        return Array.from(inputs).some(input => input.value.trim() !== '');
    },

    /**
     * Update overall progress
     */
    updateProgress() {
        const totalSections = 5;
        const completedCount = this.state.completedSections.size;
        
        Components.progress.updateSectionProgress(completedCount, totalSections);

        // Enable/disable submit button
        const submitBtn = Utils.dom.get('singlePageForm').querySelector('.submit-btn');
        if (completedCount === totalSections) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50');
        }
    },

    /**
     * Handle form submission
     */
    async handleSubmit() {
        // Final validation
        const allSectionsValid = ['basic', 'schedule', 'infrastructure', 'departments', 'contact']
            .every(section => this.validateSection(section));

        if (!allSectionsValid) {
            Components.toast.error('Please complete all required fields before submitting.');
            return;
        }

        // Show loading
        const submitBtn = Utils.dom.get('singlePageForm').querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await Utils.async.delay(2000);

            // Process form data
            const formData = this.collectFormData();
            
            // Save to storage
            const existingRequests = Utils.storage.get('workRequests', []);
            existingRequests.unshift(formData);
            Utils.storage.set('workRequests', existingRequests);

            // Show success
            this.showSuccessModal(formData.id);

        } catch (error) {
            Components.toast.error('Failed to submit request. Please try again.');
            console.error('Submission error:', error);
        } finally {
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    },

    /**
     * Collect form data
     */
    collectFormData() {
        const form = Utils.dom.get('singlePageForm');
        const formData = new FormData(form);
        
        const requestId = `WR-${String(Date.now()).slice(-4)}`;
        const now = new Date().toISOString();

        return {
            id: requestId,
            title: formData.get('title'),
            department: formData.get('department'),
            departmentName: MockData.getDepartment(formData.get('department'))?.name || '',
            workType: formData.get('workType'),
            workTypeName: MockData.getWorkType(formData.get('workType'))?.name || '',
            priority: this.state.selectedPriority,
            location: formData.get('location'),
            locationName: MockData.getLocation(formData.get('location'))?.name || '',
            description: formData.get('description'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            duration: formData.get('duration') || null,
            infrastructureAffected: Array.from(this.state.selectedInfrastructure),
            notifyDepartments: Array.from(this.state.selectedDepartments).map(deptId => {
                const dept = MockData.getDepartment(deptId);
                return {
                    id: deptId,
                    name: dept.name,
                    head: dept.head,
                    contact: dept.contact,
                    notificationSent: false,
                    clearanceReceived: false
                };
            }),
            emergencyContact: formData.get('emergencyContact') || '',
            requesterName: formData.get('requesterName') || '',
            notes: formData.get('notes') || '',
            safetyMeasures: formData.get('safetyMeasures') || '',
            status: 'pending',
            createdAt: now,
            updatedAt: now
        };
    },

    /**
     * Show success modal
     */
    showSuccessModal(requestId) {
        Utils.dom.get('generatedRequestId').textContent = requestId;
        Components.modal.show('successModal');
    }
};

// Global functions for HTML onclick handlers
window.selectAllDepartments = () => {
    MockData.departments.forEach(dept => {
        const checkbox = Utils.dom.get('departmentGrid').querySelector(`input[value="${dept.id}"]`);
        if (!checkbox.checked) {
            checkbox.checked = true;
            FormHandler.toggleDepartment(dept.id, true);
        }
    });
    Components.toast.info('All departments selected');
};

window.clearAllDepartments = () => {
    MockData.departments.forEach(dept => {
        const checkbox = Utils.dom.get('departmentGrid').querySelector(`input[value="${dept.id}"]`);
        if (checkbox.checked) {
            checkbox.checked = false;
            FormHandler.toggleDepartment(dept.id, false);
        }
    });
    Components.toast.info('All departments cleared');
};

window.previewRequest = () => {
    const formData = FormHandler.collectFormData();
    
    const previewContent = `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div><strong>Title:</strong> ${formData.title}</div>
                <div><strong>Department:</strong> ${formData.departmentName}</div>
                <div><strong>Work Type:</strong> ${formData.workTypeName}</div>
                <div><strong>Priority:</strong> ${Utils.string.titleCase(formData.priority)}</div>
                <div><strong>Location:</strong> ${formData.locationName}</div>
                <div><strong>Duration:</strong> ${formData.duration || 'Not specified'} hours</div>
            </div>
            <div><strong>Description:</strong><br>${formData.description}</div>
            <div><strong>Departments to Notify:</strong><br>
                ${formData.notifyDepartments.map(d => d.name).join(', ')}
            </div>
            ${formData.infrastructureAffected.length > 0 ? 
                `<div><strong>Infrastructure Affected:</strong><br>
                ${formData.infrastructureAffected.map(id => MockData.getInfrastructureType(id)?.name).join(', ')}
                </div>` : ''
            }
        </div>
    `;
    
    Utils.dom.get('previewContent').innerHTML = previewContent;
    Components.modal.show('previewModal');
};

window.closePreview = () => {
    Components.modal.hide('previewModal');
};

window.submitFromPreview = () => {
    Components.modal.hide('previewModal');
    FormHandler.handleSubmit();
};

window.resetForm = async () => {
    const confirmed = await Components.modal.confirm(
        'Are you sure you want to reset the form? All entered data will be lost.',
        'Reset Form'
    );
    
    if (confirmed) {
        location.reload();
    }
};

window.saveAsDraft = () => {
    const formData = FormHandler.collectFormData();
    Utils.storage.set('workRequestDraft', formData);
    Components.toast.success('Form saved as draft');
};

window.createNewRequest = () => {
    Components.modal.hide('successModal');
    location.reload();
};

window.viewDashboard = () => {
    window.location.href = '../work-clearance-system/index.html';
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormHandler;
}
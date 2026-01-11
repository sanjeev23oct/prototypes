/**
 * DAK Handling System - Core Business Logic
 * Handles letter management, approvals, and tracking
 */

const DAKSystem = {
    // Current state
    state: {
        letters: [],
        filteredLetters: [],
        currentFilters: {
            status: '',
            area: '',
            search: ''
        },
        currentUser: null,
        uploadedScan: null
    },

    /**
     * Initialize the system
     */
    init() {
        // Set default user
        this.state.currentUser = DAKData.getUser('ao_user');
        this.loadData();
        this.setupEventListeners();
        this.renderDashboard();
        this.renderLetters();
        this.updateUserDisplay();
    },

    /**
     * Load data from storage or generate mock data
     */
    loadData() {
        this.state.letters = Utils.storage.get('dakLetters') || DAKData.generateLetters();
        this.applyFilters();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // New letter button
        Utils.dom.on('newLetterBtn', 'click', () => this.showNewLetterModal());
        
        // Filter controls
        Utils.dom.on('statusFilter', 'change', (e) => this.updateFilter('status', e.target.value));
        Utils.dom.on('areaFilter', 'change', (e) => this.updateFilter('area', e.target.value));
        
        // Modal close handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    DAKComponents.modal.hide(modal.id);
                }
            }
        });
        
        // Populate area filter
        this.populateAreaFilter();
    },

    /**
     * Populate area filter dropdown
     */
    populateAreaFilter() {
        const areaFilter = Utils.dom.get('areaFilter');
        if (areaFilter) {
            DAKData.areas.forEach(area => {
                const option = Utils.dom.create('option', { value: area.id });
                option.textContent = area.name;
                areaFilter.appendChild(option);
            });
        }
    },

    /**
     * Apply current filters to letters
     */
    applyFilters() {
        let filtered = [...this.state.letters];
        
        // Status filter
        if (this.state.currentFilters.status) {
            filtered = filtered.filter(l => l.status === this.state.currentFilters.status);
        }
        
        // Area filter
        if (this.state.currentFilters.area) {
            filtered = filtered.filter(l => l.areaId === this.state.currentFilters.area);
        }
        
        // User-specific filtering
        if (this.state.currentUser) {
            filtered = this.filterByUserRole(filtered);
        }
        
        this.state.filteredLetters = filtered;
    },

    /**
     * Filter letters based on user role
     */
    filterByUserRole(letters) {
        const user = this.state.currentUser;
        
        if (user.role === 'AO') {
            return letters.filter(l => l.areaId === user.areaId);
        }
        
        if (user.role === 'CO') {
            const areas = DAKData.areas.filter(a => a.coordinatorId === user.coordinatorId);
            const areaIds = areas.map(a => a.id);
            return letters.filter(l => areaIds.includes(l.areaId));
        }
        
        if (user.role === 'ZO') {
            const coordinators = DAKData.coordinators.filter(c => c.zoneId === user.zoneId);
            const coordinatorIds = coordinators.map(c => c.id);
            const areas = DAKData.areas.filter(a => coordinatorIds.includes(a.coordinatorId));
            const areaIds = areas.map(a => a.id);
            return letters.filter(l => areaIds.includes(l.areaId));
        }
        
        if (user.role === 'SO') {
            return letters.filter(l => l.satsangPlaceId === user.satsangPlaceId);
        }
        
        // SCI can see all letters
        return letters;
    },

    /**
     * Update filter and refresh display
     */
    updateFilter(filterType, value) {
        this.state.currentFilters[filterType] = value;
        this.applyFilters();
        this.renderLetters();
    },

    /**
     * Render dashboard statistics
     */
    renderDashboard() {
        const stats = DAKData.getStatistics(this.state.letters, this.state.currentUser);
        
        const pendingCount = Utils.dom.get('pendingCount');
        const markedCount = Utils.dom.get('markedCount');
        const sciCount = Utils.dom.get('sciCount');
        const completedCount = Utils.dom.get('completedCount');
        
        if (pendingCount) pendingCount.textContent = stats.pending;
        if (markedCount) markedCount.textContent = stats.markedToMe;
        if (sciCount) sciCount.textContent = stats.sentToSCI;
        if (completedCount) completedCount.textContent = stats.completed;
    },

    /**
     * Render letters table
     */
    renderLetters() {
        const tbody = Utils.dom.get('lettersTableBody');
        Utils.dom.empty(tbody);
        
        if (this.state.filteredLetters.length === 0) {
            const row = Utils.dom.create('tr');
            row.innerHTML = `
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-inbox text-4xl mb-2"></i>
                    <div>No letters found</div>
                </td>
            `;
            tbody.appendChild(row);
            return;
        }
        
        this.state.filteredLetters.forEach(letter => {
            const row = this.createLetterRow(letter);
            tbody.appendChild(row);
        });
    },

    /**
     * Create a table row for a letter
     */
    createLetterRow(letter) {
        const row = Utils.dom.create('tr', {
            className: 'hover:bg-gray-50 cursor-pointer'
        });
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${letter.id}
                ${!letter.scanUploaded ? '<i class="fas fa-exclamation-triangle text-red-500 ml-2" title="Scan not uploaded"></i>' : ''}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${letter.areaName}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
                <div>${letter.subjectName}</div>
                ${letter.isDonation ? `<div class="text-xs text-green-600 mt-1">₹${letter.donationAmount?.toLocaleString()}</div>` : ''}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${Utils.date.format(letter.letterDate)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge status-${letter.status}">
                    ${letter.status.replace(/_/g, ' ')}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center">
                    <span class="px-2 py-1 rounded text-xs font-medium office-${letter.markedTo.office}">
                        ${letter.markedTo.office}
                    </span>
                    <span class="ml-2">${letter.markedTo.person}</span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                    <button class="text-blue-600 hover:text-blue-900" onclick="DAKSystem.viewLetter('${letter.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${this.canProcessLetter(letter) ? `
                        <button class="text-green-600 hover:text-green-900" onclick="DAKSystem.processLetter('${letter.id}')">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        
        // Add click handler for row
        row.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                this.viewLetter(letter.id);
            }
        });
        
        return row;
    },

    /**
     * Check if user can process letter
     */
    canProcessLetter(letter) {
        const user = this.state.currentUser;
        if (!user) return false;
        
        // AO can only create letters
        if (user.role === 'AO') return false;
        
        // SO can only view
        if (user.role === 'SO') return false;
        
        // Check if letter is marked to user's office
        return DAKData.isMarkedToUser(letter, user) && letter.status !== 'COMPLETED';
    },

    /**
     * Show new letter modal
     */
    showNewLetterModal() {
        if (this.state.currentUser.role !== 'AO') {
            DAKComponents.toast.error('Only Area Office users can create new letters');
            return;
        }
        
        const modal = DAKComponents.modal.show('newLetterModal');
        this.renderNewLetterForm();
    },

    /**
     * Render new letter form
     */
    renderNewLetterForm() {
        const form = Utils.dom.get('newLetterForm');
        const user = this.state.currentUser;
        const userArea = DAKData.getArea(user.areaId);
        
        form.innerHTML = `
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Area (read-only for AO) -->
                    <div class="form-group">
                        <label class="form-label required">Area</label>
                        <input type="text" class="form-input" value="${userArea.name}" readonly>
                        <input type="hidden" name="areaId" value="${userArea.id}">
                    </div>
                    
                    <!-- Satsang Place -->
                    <div class="form-group">
                        <label class="form-label required">Satsang Place</label>
                        <select class="form-select" name="satsangPlaceId" data-validate="required">
                            <option value="">Select Satsang Place</option>
                            ${DAKData.satsangPlaces
                                .filter(sp => sp.areaId === userArea.id)
                                .map(sp => `<option value="${sp.id}">${sp.name} (${sp.type})</option>`)
                                .join('')}
                        </select>
                    </div>
                    
                    <!-- Letter Date -->
                    <div class="form-group">
                        <label class="form-label required">Letter Date</label>
                        <input type="date" class="form-input" name="letterDate" data-validate="required" 
                               value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    
                    <!-- Reference Number -->
                    <div class="form-group">
                        <label class="form-label required">Reference Number</label>
                        <input type="text" class="form-input" name="referenceNumber" data-validate="required"
                               placeholder="REF/AMR/001/2025">
                    </div>
                    
                    <!-- Subject -->
                    <div class="form-group md:col-span-2">
                        <label class="form-label required">Subject</label>
                        <select class="form-select" name="subjectId" data-validate="required" id="subjectSelect">
                            <option value="">Select Subject</option>
                            ${DAKData.subjects.map(sub => 
                                `<option value="${sub.id}" data-category="${sub.category}">${sub.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <!-- Document Type -->
                    <div class="form-group">
                        <label class="form-label required">Document Type</label>
                        <select class="form-select" name="documentTypeId" data-validate="required">
                            <option value="">Select Document Type</option>
                            ${DAKData.documentTypes.map(doc => 
                                `<option value="${doc.id}">${doc.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <!-- Donation Amount (conditional) -->
                    <div class="form-group hidden" id="donationAmountGroup">
                        <label class="form-label required">Donation Amount (₹)</label>
                        <input type="number" class="form-input" name="donationAmount" id="donationAmountInput"
                               placeholder="25000" min="0">
                    </div>
                    
                    <!-- Letter Scan Upload -->
                    <div class="form-group md:col-span-2">
                        <label class="form-label required">Letter Scan Upload</label>
                        <div class="scan-upload-area" id="scanUploadArea">
                            <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                            <div class="text-sm text-gray-600 mb-2">Click to upload or drag and drop</div>
                            <div class="text-xs text-gray-500">JPG, PNG or PDF (Max 5MB)</div>
                            <input type="file" name="letterScan" id="letterScanInput" class="hidden" 
                                   accept="image/*,.pdf" data-validate="required">
                        </div>
                        <div id="scanPreview" class="mt-3 hidden"></div>
                    </div>
                    
                    <!-- Description -->
                    <div class="form-group md:col-span-2">
                        <label class="form-label">Additional Notes</label>
                        <textarea class="form-textarea" name="description" rows="3"
                                  placeholder="Any additional information about this letter"></textarea>
                    </div>
                </div>
                
                <!-- Auto-marking Info -->
                <div class="alert alert-info">
                    <i class="fas fa-info-circle alert-icon"></i>
                    <div class="alert-content">
                        <div class="alert-title">Auto-Marking</div>
                        <div class="alert-message">
                            This letter will be automatically marked to the appropriate office based on the subject selected.
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
                <button type="button" class="btn btn-secondary" onclick="DAKComponents.modal.hide('newLetterModal')">
                    Cancel
                </button>
                <button type="submit" class="btn btn-success">
                    <i class="fas fa-paper-plane"></i> Submit Letter
                </button>
            </div>
        `;
        
        this.setupNewLetterForm();
    },

    /**
     * Setup new letter form handlers
     */
    setupNewLetterForm() {
        const form = Utils.dom.get('newLetterForm');
        const subjectSelect = Utils.dom.get('subjectSelect');
        const donationAmountGroup = Utils.dom.get('donationAmountGroup');
        const scanUploadArea = Utils.dom.get('scanUploadArea');
        const scanInput = Utils.dom.get('letterScanInput');
        const scanPreview = Utils.dom.get('scanPreview');
        
        // Subject change handler - show/hide donation amount
        if (subjectSelect) {
            subjectSelect.addEventListener('change', (e) => {
                const selectedOption = e.target.options[e.target.selectedIndex];
                const category = selectedOption.getAttribute('data-category');
                
                if (category === 'donation') {
                    donationAmountGroup.classList.remove('hidden');
                    Utils.dom.get('donationAmountInput').setAttribute('data-validate', 'required|number');
                } else {
                    donationAmountGroup.classList.add('hidden');
                    Utils.dom.get('donationAmountInput').removeAttribute('data-validate');
                }
            });
        }
        
        // Scan upload area click handler
        if (scanUploadArea) {
            scanUploadArea.addEventListener('click', () => scanInput.click());
        }
        
        // File input change handler
        if (scanInput) {
            scanInput.addEventListener('change', (e) => {
                DAKComponents.handleFileUpload(e, (file) => {
                    this.state.uploadedScan = file;
                    scanUploadArea.classList.add('has-file');
                    scanPreview.innerHTML = DAKComponents.renderFilePreview(file);
                    scanPreview.classList.remove('hidden');
                });
            });
        }
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!this.state.uploadedScan) {
                DAKComponents.toast.error('Please upload letter scan');
                return;
            }
            
            if (DAKComponents.validation.validateForm(form)) {
                this.submitNewLetter(form);
            } else {
                DAKComponents.toast.error('Please fill all required fields correctly');
            }
        });
    },

    /**
     * Submit new letter
     */
    submitNewLetter(form) {
        const formData = new FormData(form);
        const subject = DAKData.getSubject(formData.get('subjectId'));
        const area = DAKData.getArea(formData.get('areaId'));
        
        const newLetter = {
            id: `LTR-${area.code}-${String(this.state.letters.length + 1).padStart(4, '0')}`,
            areaId: formData.get('areaId'),
            areaName: area.name,
            satsangPlaceId: formData.get('satsangPlaceId'),
            satsangPlaceName: DAKData.satsangPlaces.find(sp => sp.id === formData.get('satsangPlaceId')).name,
            satsangPlaceType: DAKData.satsangPlaces.find(sp => sp.id === formData.get('satsangPlaceId')).type,
            letterDate: formData.get('letterDate'),
            referenceNumber: formData.get('referenceNumber'),
            subjectId: formData.get('subjectId'),
            subjectName: subject.name,
            subjectCategory: subject.category,
            isSCM: subject.isSCM,
            documentTypeId: formData.get('documentTypeId'),
            documentTypeName: DAKData.documentTypes.find(dt => dt.id === formData.get('documentTypeId')).name,
            status: 'NEW',
            isDonation: subject.category === 'donation',
            donationAmount: formData.get('donationAmount') ? parseInt(formData.get('donationAmount')) : null,
            scanUploaded: true,
            scanUploadDate: new Date().toISOString(),
            markedTo: DAKData.getMarkedTo(subject, area),
            markedBy: 'System Auto-Marking',
            markedDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            createdBy: this.state.currentUser.id,
            trail: [{
                date: new Date().toISOString(),
                action: 'Letter Created',
                by: `${this.state.currentUser.name} (${this.state.currentUser.role})`,
                office: this.state.currentUser.office,
                details: 'Letter entry created with scan upload'
            }],
            messages: [],
            emailTrail: []
        };
        
        this.state.letters.unshift(newLetter);
        Utils.storage.set('dakLetters', this.state.letters);
        
        DAKComponents.modal.hide('newLetterModal');
        DAKComponents.toast.success('Letter created successfully');
        
        this.applyFilters();
        this.renderLetters();
        this.renderDashboard();
        
        // Reset uploaded scan
        this.state.uploadedScan = null;
    },

    /**
     * View letter details
     */
    viewLetter(letterId) {
        const letter = this.state.letters.find(l => l.id === letterId);
        if (!letter) return;
        
        const modal = DAKComponents.modal.show('letterDetailsModal');
        const content = Utils.dom.get('letterDetailsContent');
        
        content.innerHTML = `
            <div class="space-y-6">
                <!-- Letter Header -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">${letter.id}</h3>
                            <p class="text-sm text-gray-600">${letter.subjectName}</p>
                        </div>
                        <span class="badge status-${letter.status}">${letter.status.replace(/_/g, ' ')}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-gray-600">Area:</span>
                            <span class="font-medium ml-2">${letter.areaName}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Satsang Place:</span>
                            <span class="font-medium ml-2">${letter.satsangPlaceName}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Letter Date:</span>
                            <span class="font-medium ml-2">${Utils.date.format(letter.letterDate)}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Reference:</span>
                            <span class="font-medium ml-2">${letter.referenceNumber}</span>
                        </div>
                        ${letter.isDonation ? `
                        <div class="col-span-2">
                            <span class="text-gray-600">Donation Amount:</span>
                            <span class="donation-amount ml-2">₹${letter.donationAmount?.toLocaleString()}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Marked To -->
                <div>
                    <h4 class="font-semibold text-gray-900 mb-2">Currently Marked To</h4>
                    <div class="auto-marked">
                        <i class="fas fa-robot"></i>
                        <span>${letter.markedTo.officeName} - ${letter.markedTo.person}</span>
                    </div>
                </div>
                
                <!-- Letter Trail -->
                <div>
                    <h4 class="font-semibold text-gray-900 mb-3">Letter Trail</h4>
                    ${DAKComponents.renderLetterTrail(letter.trail)}
                </div>
                
                <!-- Messages -->
                ${letter.messages && letter.messages.length > 0 ? `
                <div>
                    <h4 class="font-semibold text-gray-900 mb-3">Messages</h4>
                    ${DAKComponents.renderMessages(letter.messages)}
                </div>
                ` : ''}
                
                <!-- Email Trail -->
                ${letter.emailTrail && letter.emailTrail.length > 0 ? `
                <div>
                    <h4 class="font-semibold text-gray-900 mb-3">Email Trail</h4>
                    ${DAKComponents.renderEmailTrail(letter.emailTrail)}
                </div>
                ` : ''}
            </div>
        `;
    },

    /**
     * Process letter (for CO/ZO/SCI users)
     */
    processLetter(letterId) {
        DAKComponents.toast.info('Letter processing functionality - to be implemented');
    },

    /**
     * Load sample letter data
     */
    loadSampleLetter() {
        const sample = DAKData.getSampleLetter(0);
        const form = Utils.dom.get('newLetterForm');
        
        // Populate form fields
        Object.keys(sample).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = sample[key];
                
                // Trigger change event for subject to show donation field
                if (key === 'subjectId') {
                    input.dispatchEvent(new Event('change'));
                }
            }
        });
        
        DAKComponents.toast.success('Sample data loaded');
    },

    /**
     * Impersonate user (demo mode)
     */
    impersonateUser(userId) {
        const user = DAKData.getUser(userId);
        if (!user) return;
        
        this.state.currentUser = user;
        this.updateUserDisplay();
        this.applyFilters();
        this.renderLetters();
        this.renderDashboard();
        
        DAKComponents.toast.success(`Switched to ${user.name} (${user.role})`);
    },

    /**
     * Update user display
     */
    updateUserDisplay() {
        const user = this.state.currentUser;
        if (!user) return;
        
        const nameEl = Utils.dom.get('currentUserName');
        const roleEl = Utils.dom.get('currentUserRole');
        const displayEl = Utils.dom.get('currentUserDisplay');
        
        if (nameEl) nameEl.textContent = user.name;
        if (roleEl) roleEl.textContent = user.office;
        if (displayEl) displayEl.textContent = `${user.avatar} ${user.name}`;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DAKSystem;
}

console.log('✓ dak-system.js loaded successfully');

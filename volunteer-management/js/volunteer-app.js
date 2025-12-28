/**
 * Main Volunteer Management Application
 * Coordinates all components and manages application state
 */

class VolunteerApp {
    constructor() {
        this.volunteers = [];
        this.filteredVolunteers = [];
        this.currentFilter = {
            gender: 'all',
            initiated: 'all',
            search: ''
        };
        
        this.init();
    }
    
    // Initialize the application
    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.applyFilters();
        
        // Show welcome message
        setTimeout(() => {
            ToastManager.show('Volunteer Management System loaded successfully', 'success');
        }, 500);
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilter.search = e.target.value;
                this.applyFilters();
            });
        }
        
        // Auto-save every 30 seconds
        setInterval(() => {
            if (this.volunteers.length > 0) {
                this.saveToLocalStorage(false); // Silent save
            }
        }, 30000);
        
        // Save before page unload
        window.addEventListener('beforeunload', () => {
            this.saveToLocalStorage(false);
        });
    }
    
    // Add a new volunteer row
    addNewRow() {
        const newVolunteer = new Volunteer({
            operation: 'Add',
            isNew: true
        });
        
        this.volunteers.push(newVolunteer);
        this.applyFilters();
        ToastManager.show('New volunteer row added', 'success');
        
        // Focus on the name field of the new row
        setTimeout(() => {
            const nameInput = document.querySelector(`tr[data-volunteer-id="${newVolunteer.id}"] input[placeholder*="name"]`);
            if (nameInput) nameInput.focus();
        }, 100);
    }
    
    // Add multiple rows at once
    addMultipleRows(count = 5) {
        const newVolunteers = [];
        for (let i = 0; i < count; i++) {
            newVolunteers.push(new Volunteer({
                operation: 'Add',
                isNew: true
            }));
        }
        
        this.volunteers.push(...newVolunteers);
        this.applyFilters();
        ToastManager.show(`Added ${count} new volunteer rows`, 'success');
    }
    
    // Add multiple volunteers (for paste operation)
    addVolunteers(volunteers) {
        this.volunteers.push(...volunteers);
        this.applyFilters();
    }
    
    // Update a volunteer field
    updateVolunteer(id, field, value) {
        const idStr = String(id);
        
        // Handle empty row activation
        if (idStr.startsWith('empty-') || idStr.startsWith('extra-')) {
            // Create new volunteer when user starts typing in empty row
            const newVolunteer = new Volunteer({
                [field]: value,
                operation: 'Add',
                isNew: true
            });
            
            this.volunteers.push(newVolunteer);
            this.applyFilters();
            return;
        }
        
        const volunteer = this.volunteers.find(v => v.id === id);
        if (!volunteer) return;
        
        // Format mobile numbers
        if (field === 'mobileNumber' || field === 'emergencyNumber') {
            const validation = DataValidator.validateMobile(value);
            value = validation.cleaned;
        }
        
        // Format Aadhar number
        if (field === 'aadharNumber') {
            const validation = DataValidator.validateAadhar(value);
            value = validation.cleaned;
        }
        
        volunteer.update(field, value);
        this.applyFilters();
    }
    
    // Delete a volunteer
    deleteVolunteer(id) {
        if (confirm('Are you sure you want to delete this volunteer record?')) {
            this.volunteers = this.volunteers.filter(v => v.id !== id);
            this.applyFilters();
            ToastManager.show('Volunteer record deleted', 'success');
        }
    }
    
    // Delete multiple volunteers
    deleteVolunteers(ids) {
        this.volunteers = this.volunteers.filter(v => !ids.includes(v.id));
        this.applyFilters();
    }
    
    // Duplicate a volunteer
    duplicateVolunteer(id) {
        const original = this.volunteers.find(v => v.id === id);
        if (!original) return;
        
        const duplicate = new Volunteer({
            ...original,
            id: Date.now() + Math.random(),
            badgeNumber: '', // Clear badge number for manual entry
            isNew: true
        });
        
        this.volunteers.push(duplicate);
        this.applyFilters();
        ToastManager.show('Volunteer record duplicated', 'success');
    }
    
    // Filter volunteers by gender
    filterByGender(gender) {
        this.currentFilter.gender = gender;
        
        // Update button styles
        document.querySelectorAll('[id^="filter-"]').forEach(btn => {
            if (btn.id.includes('male') || btn.id === 'filter-all') {
                btn.className = 'px-4 py-2 rounded-lg text-sm font-medium filter-btn';
            }
        });
        
        const activeBtn = document.getElementById(gender === 'all' ? 'filter-all' : `filter-${gender.toLowerCase()}`);
        if (activeBtn) {
            activeBtn.className += ' active';
        }
        
        this.applyFilters();
    }
    
    // Filter volunteers by initiation status
    filterByInitiation(initiated) {
        this.currentFilter.initiated = initiated;
        
        // Update button styles
        document.querySelectorAll('[id^="filter-init"]').forEach(btn => {
            btn.className = 'px-4 py-2 rounded-lg text-sm font-medium filter-btn';
        });
        
        const activeBtn = document.getElementById(
            initiated === 'all' ? 'filter-init-all' : 
            initiated === 'true' ? 'filter-initiated' : 'filter-not-initiated'
        );
        if (activeBtn) {
            activeBtn.className += ' active';
        }
        
        this.applyFilters();
    }
    
    // Apply all current filters
    applyFilters() {
        this.filteredVolunteers = FilterManager.applyFilters(this.volunteers, this.currentFilter);
        volunteerSpreadsheet.render(this.filteredVolunteers);
        StatsCalculator.updateStatsDisplay(this.volunteers);
    }
    
    // Clear all volunteers and reset system
    clearAll() {
        if (this.volunteers.length === 0) {
            ToastManager.show('No data to clear - table is already empty', 'info');
            return;
        }
        
        const count = this.volunteers.length;
        if (confirm(`Clear all ${count} volunteer records?\n\nThis will remove all data and cannot be undone.`)) {
            // Clear all data
            this.volunteers = [];
            this.filteredVolunteers = [];
            
            // Clear selections
            if (volunteerSpreadsheet) {
                volunteerSpreadsheet.clearSelection();
            }
            
            // Clear localStorage
            StorageManager.clear();
            
            // Reset filters
            this.currentFilter = {
                gender: 'all',
                initiated: 'all',
                search: ''
            };
            
            // Clear search input
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = '';
            
            // Reset filter buttons
            this.resetFilterButtons();
            
            // Refresh display
            this.applyFilters();
            
            ToastManager.show(`Cleared all ${count} volunteer records`, 'success');
        }
    }
    
    // Reset filter buttons to default state
    resetFilterButtons() {
        // Reset gender filter buttons
        document.querySelectorAll('[id^="filter-"]').forEach(btn => {
            btn.className = 'px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300';
        });
        
        // Set "All" buttons as active
        const allGenderBtn = document.getElementById('filter-all');
        const allInitBtn = document.getElementById('filter-init-all');
        
        if (allGenderBtn) {
            allGenderBtn.className = 'px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white';
        }
        if (allInitBtn) {
            allInitBtn.className = 'px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white';
        }
    }
    
    // Load sample data
    loadSampleData() {
        if (this.volunteers.length > 0) {
            if (!confirm('This will add sample data to existing records. Continue?')) {
                return;
            }
        }
        
        const sampleVolunteers = SAMPLE_VOLUNTEERS.map(data => new Volunteer(data));
        this.volunteers.push(...sampleVolunteers);
        IDGenerator.initializeTempId(this.volunteers);
        this.applyFilters();
        ToastManager.show(`Loaded ${sampleVolunteers.length} sample volunteer records`, 'success');
    }
    
    // Export data to CSV
    exportData() {
        if (this.volunteers.length === 0) {
            ToastManager.show('No data to export', 'warning');
            return;
        }
        
        CSVManager.exportToCSV(this.volunteers);
    }
    
    // Save to localStorage
    saveToLocalStorage(showToast = true) {
        const success = StorageManager.save(this.volunteers);
        if (showToast) {
            ToastManager.show(
                success ? 'Data saved successfully' : 'Failed to save data', 
                success ? 'success' : 'error'
            );
        }
        return success;
    }
    
    // Load from localStorage
    loadFromLocalStorage() {
        const savedVolunteers = StorageManager.load();
        if (savedVolunteers && savedVolunteers.length > 0) {
            this.volunteers = savedVolunteers.map(data => new Volunteer(data));
            ToastManager.show(`Loaded ${this.volunteers.length} saved volunteer records`, 'info');
        }
    }
    
    // Get all volunteers
    getAllVolunteers() {
        return this.volunteers;
    }
    
    // Get filtered volunteers
    getFilteredVolunteers() {
        return this.filteredVolunteers;
    }
    
    // Validate all volunteers
    validateAllVolunteers() {
        const errors = [];
        this.volunteers.forEach((volunteer, index) => {
            const validation = volunteer.validate();
            if (!validation.isValid) {
                errors.push({
                    row: index + 1,
                    name: volunteer.name || 'Unnamed',
                    errors: validation.errors
                });
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    // Show validation results
    showValidationResults() {
        const validation = this.validateAllVolunteers();
        
        if (validation.isValid) {
            ToastManager.show('All volunteer records are valid', 'success');
        } else {
            const errorCount = validation.errors.length;
            const errorMessage = `Found ${errorCount} record(s) with validation errors`;
            ToastManager.show(errorMessage, 'error', 5000);
            
            // Log detailed errors to console
            console.group('Validation Errors:');
            validation.errors.forEach(error => {
                console.log(`Row ${error.row} (${error.name}):`, error.errors);
            });
            console.groupEnd();
        }
        
        return validation;
    }
    
    // Show paste from Excel dialog
    showPasteFromExcel() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-semibold">Paste from Excel</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="mb-4">
                    <p class="text-gray-600 mb-2">Copy data from Excel and paste it in the text area below:</p>
                    <div class="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4">
                        <strong>Expected column order:</strong><br>
                        Type | Volunteer ID | Name | Mobile Number | Aadhar Card | Address | Event/Cause
                    </div>
                </div>
                
                <textarea id="excelPasteArea" 
                          class="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Paste your Excel data here (Ctrl+V)..."></textarea>
                
                <div class="flex justify-between items-center mt-4">
                    <div class="text-sm text-gray-500">
                        <i class="fas fa-info-circle mr-1"></i>
                        Tip: Select and copy rows from Excel, then paste here
                    </div>
                    <div class="flex gap-3">
                        <button onclick="this.closest('.fixed').remove()" 
                                class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                            Cancel
                        </button>
                        <button onclick="volunteerApp.processPastedExcelData()" 
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Import Data
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Focus on textarea
        setTimeout(() => {
            document.getElementById('excelPasteArea').focus();
        }, 100);
    }
    
    // Process pasted Excel data from modal
    async processPastedExcelData() {
        const textarea = document.getElementById('excelPasteArea');
        const text = textarea.value.trim();
        
        if (!text) {
            ToastManager.show('Please paste some data first', 'warning');
            return;
        }
        
        const volunteers = ClipboardManager.parseTabDelimitedData(text);
        
        if (volunteers.length > 0) {
            this.addVolunteers(volunteers);
            ToastManager.show(`Imported ${volunteers.length} volunteer(s) from Excel`, 'success');
            
            // Close modal
            document.querySelector('.fixed.inset-0').remove();
        } else {
            ToastManager.show('No valid volunteer data found', 'error');
        }
    }
    
    // Validate all volunteers and show results
    validateAllRecords() {
        const validation = this.validateAllVolunteers();
        
        if (validation.isValid) {
            ToastManager.show('All volunteer records are valid! ✅', 'success');
            return;
        }
        
        this.showValidationResults(validation.errors);
    }
    
    // Show detailed validation results
    showValidationResults(errors) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
                <div class="flex items-center justify-between p-6 border-b">
                    <h3 class="text-xl font-semibold text-red-600">
                        <i class="fas fa-exclamation-circle mr-2"></i>
                        Validation Results
                    </h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="p-6 overflow-y-auto max-h-96">
                    <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p class="text-red-800 font-medium">
                            Found ${errors.length} record(s) with validation errors:
                        </p>
                    </div>
                    
                    <div class="space-y-3">
                        ${errors.map(error => `
                            <div class="border border-red-200 rounded-lg p-4 bg-red-50">
                                <div class="flex items-center justify-between mb-2">
                                    <h4 class="font-medium text-red-800">
                                        Row ${error.row}: ${error.name || 'Unnamed Volunteer'}
                                    </h4>
                                    <button onclick="volunteerApp.focusOnRow(${error.row - 1})" 
                                            class="text-blue-600 hover:text-blue-800 text-sm">
                                        Go to Row
                                    </button>
                                </div>
                                <ul class="text-sm text-red-700 space-y-1">
                                    ${error.errors.map(err => `<li>• ${err}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="flex justify-between items-center p-6 border-t bg-gray-50">
                    <div class="text-sm text-gray-600">
                        Fix the errors above to ensure data quality
                    </div>
                    <div class="flex gap-3">
                        <button onclick="this.closest('.fixed').remove()" 
                                class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                            Close
                        </button>
                        <button onclick="volunteerApp.highlightErrorRows(); this.closest('.fixed').remove();" 
                                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                            Highlight Errors
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Check for duplicate volunteers
    showDuplicateCheck() {
        const duplicates = this.findDuplicateVolunteers();
        
        if (duplicates.length === 0) {
            ToastManager.show('No duplicate volunteers found! ✅', 'success');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
                <div class="flex items-center justify-between p-6 border-b">
                    <h3 class="text-xl font-semibold text-orange-600">
                        <i class="fas fa-users mr-2"></i>
                        Duplicate Volunteers Found
                    </h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="p-6 overflow-y-auto max-h-96">
                    <div class="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <p class="text-orange-800 font-medium">
                            Found ${duplicates.length} group(s) of duplicate volunteers:
                        </p>
                    </div>
                    
                    <div class="space-y-4">
                        ${duplicates.map((group, index) => `
                            <div class="border border-orange-200 rounded-lg p-4 bg-orange-50">
                                <h4 class="font-medium text-orange-800 mb-3">
                                    Duplicate Group ${index + 1} - ${group.type}
                                </h4>
                                <div class="grid gap-2">
                                    ${group.volunteers.map(v => `
                                        <div class="flex items-center justify-between bg-white p-3 rounded border">
                                            <div>
                                                <strong>${v.name || 'Unnamed'}</strong> 
                                                (ID: ${v.volunteerId || 'None'}, Mobile: ${v.mobile || 'None'})
                                            </div>
                                            <div class="flex gap-2">
                                                <button onclick="volunteerApp.focusOnVolunteer(${v.id})" 
                                                        class="text-blue-600 hover:text-blue-800 text-sm">
                                                    View
                                                </button>
                                                <button onclick="volunteerApp.deleteVolunteer(${v.id})" 
                                                        class="text-red-600 hover:text-red-800 text-sm">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="flex justify-between items-center p-6 border-t bg-gray-50">
                    <div class="text-sm text-gray-600">
                        Review and remove duplicate entries to maintain data integrity
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Find duplicate volunteers
    findDuplicateVolunteers() {
        const duplicates = [];
        const seen = new Map();
        
        this.volunteers.forEach(volunteer => {
            // Check for duplicate volunteer IDs
            if (volunteer.volunteerId) {
                const key = `id:${volunteer.volunteerId}`;
                if (seen.has(key)) {
                    seen.get(key).volunteers.push(volunteer);
                } else {
                    seen.set(key, {
                        type: 'Volunteer ID',
                        volunteers: [volunteer]
                    });
                }
            }
            
            // Check for duplicate mobile numbers
            if (volunteer.mobile) {
                const key = `mobile:${volunteer.mobile}`;
                if (seen.has(key)) {
                    seen.get(key).volunteers.push(volunteer);
                } else {
                    seen.set(key, {
                        type: 'Mobile Number',
                        volunteers: [volunteer]
                    });
                }
            }
            
            // Check for duplicate name + mobile combination
            if (volunteer.name && volunteer.mobile) {
                const key = `name-mobile:${volunteer.name.toLowerCase()}-${volunteer.mobile}`;
                if (seen.has(key)) {
                    seen.get(key).volunteers.push(volunteer);
                } else {
                    seen.set(key, {
                        type: 'Name + Mobile',
                        volunteers: [volunteer]
                    });
                }
            }
        });
        
        // Return only groups with more than one volunteer
        seen.forEach(group => {
            if (group.volunteers.length > 1) {
                duplicates.push(group);
            }
        });
        
        return duplicates;
    }
    
    // Focus on a specific row
    focusOnRow(rowIndex) {
        const rows = document.querySelectorAll('#volunteerTableBody tr');
        if (rows[rowIndex]) {
            rows[rowIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            rows[rowIndex].classList.add('highlight-error');
            setTimeout(() => {
                rows[rowIndex].classList.remove('highlight-error');
            }, 3000);
        }
    }
    
    // Focus on a specific volunteer
    focusOnVolunteer(volunteerId) {
        const volunteer = this.volunteers.find(v => v.id === volunteerId);
        if (volunteer) {
            const filteredIndex = this.filteredVolunteers.findIndex(v => v.id === volunteerId);
            if (filteredIndex >= 0) {
                this.focusOnRow(filteredIndex);
            }
        }
    }
    
    // Delete all rows with confirmation
    deleteAllRows() {
        if (this.volunteers.length === 0) {
            ToastManager.show('No records to delete', 'warning');
            return;
        }
        
        const count = this.volunteers.length;
        const confirmMessage = `⚠️ WARNING: This will permanently delete ALL ${count} volunteer records!\n\nThis action cannot be undone. Are you absolutely sure?`;
        
        if (confirm(confirmMessage)) {
            // Double confirmation for safety
            const doubleConfirm = confirm(`🚨 FINAL CONFIRMATION:\n\nDelete ${count} volunteer records permanently?\n\nClick OK to DELETE ALL or Cancel to keep records.`);
            
            if (doubleConfirm) {
                this.volunteers = [];
                volunteerSpreadsheet.clearSelection();
                this.applyFilters();
                StorageManager.clear();
                ToastManager.show(`Deleted all ${count} volunteer records`, 'success');
            }
        }
    }
    
    // Delete selected rows (enhanced)
    deleteSelectedRows() {
        const selectedIds = Array.from(volunteerSpreadsheet.selectedRows);
        
        if (selectedIds.length === 0) {
            ToastManager.show('No rows selected. Click row numbers to select rows for deletion.', 'warning');
            return;
        }
        
        const selectedVolunteers = this.volunteers.filter(v => selectedIds.includes(v.id));
        const volunteerNames = selectedVolunteers.map(v => v.name || 'Unnamed').slice(0, 3);
        const namesList = volunteerNames.join(', ') + (selectedVolunteers.length > 3 ? ` and ${selectedVolunteers.length - 3} more` : '');
        
        const confirmMessage = `Delete ${selectedIds.length} volunteer record(s)?\n\n${namesList}\n\nThis action cannot be undone.`;
        
        if (confirm(confirmMessage)) {
            this.deleteVolunteers(selectedIds);
            volunteerSpreadsheet.selectedRows.clear();
            ToastManager.show(`Deleted ${selectedIds.length} volunteer record(s)`, 'success');
        }
    }
    
    // Delete last N rows
    deleteLastRows(count = 1) {
        if (this.volunteers.length === 0) {
            ToastManager.show('No records to delete', 'warning');
            return;
        }
        
        const actualCount = Math.min(count, this.volunteers.length);
        
        if (confirm(`Delete the last ${actualCount} row(s)?`)) {
            this.volunteers.splice(-actualCount, actualCount);
            this.applyFilters();
            ToastManager.show(`Deleted last ${actualCount} row(s)`, 'success');
        }
    }
    
    // Delete empty rows
    deleteEmptyRows() {
        const emptyRows = this.volunteers.filter(v => 
            !v.name.trim() && 
            !v.mobileNumber.trim() && 
            !v.address.trim()
        );
        
        if (emptyRows.length === 0) {
            ToastManager.show('No empty rows found', 'info');
            return;
        }
        
        if (confirm(`Delete ${emptyRows.length} empty row(s)?`)) {
            const emptyIds = emptyRows.map(v => v.id);
            this.deleteVolunteers(emptyIds);
            ToastManager.show(`Deleted ${emptyRows.length} empty row(s)`, 'success');
        }
    }
}

// Initialize the application
let volunteerApp;
document.addEventListener('DOMContentLoaded', () => {
    volunteerApp = new VolunteerApp();
});
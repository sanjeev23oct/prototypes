/**
 * Volunteer Spreadsheet Component
 * Handles the Excel-like grid interface and interactions
 */

class VolunteerSpreadsheet {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.tbody = document.getElementById('volunteerTableBody');
        this.emptyState = document.getElementById('emptyState');
        this.selectedRows = new Set();
        this.selectedCell = null;
        this.lastSelectedRow = null;
        this.pasteStartCell = null;
        
        this.initializeEventListeners();
    }
    
    // Initialize event listeners
    initializeEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'c':
                        if (this.selectedRows.size > 0) {
                            e.preventDefault();
                            this.copySelectedRows();
                        }
                        break;
                    case 'v':
                        e.preventDefault();
                        this.handlePaste(e);
                        break;
                    case 's':
                        e.preventDefault();
                        volunteerApp.saveToLocalStorage();
                        break;
                    case 'a':
                        e.preventDefault();
                        this.selectAll();
                        break;
                }
            }
            
            if (e.key === 'Delete' && this.selectedRows.size > 0) {
                e.preventDefault();
                this.deleteSelectedRows();
            }
        });
        
        // Cell-level paste event listener
        document.addEventListener('paste', async (e) => {
            // Handle paste in any cell or when a cell is selected
            if (this.selectedCell || e.target.matches('input, textarea, select')) {
                await this.handleCellPaste(e);
            }
        });
    }
    
    // Handle paste at cell level
    async handleCellPaste(event) {
        event.preventDefault();
        
        // Determine paste start position
        let startRow = 0;
        let startCol = 0;
        
        if (this.selectedCell) {
            const cellInfo = this.getCellPosition(this.selectedCell);
            startRow = cellInfo.row;
            startCol = cellInfo.col;
        } else if (event.target.closest('tr')) {
            const row = event.target.closest('tr');
            const cell = event.target.closest('td');
            startRow = Array.from(this.tbody.children).indexOf(row);
            startCol = Array.from(row.children).indexOf(cell) - 1; // -1 for row number column
        }
        
        // Parse clipboard data
        const volunteers = await ClipboardManager.parseClipboardData(event.clipboardData);
        
        if (volunteers.length > 0) {
            this.pasteAtPosition(volunteers, startRow, startCol);
        }
    }
    
    // Paste volunteers at specific grid position with conflict resolution
    pasteAtPosition(volunteers, startRow, startCol) {
        const currentVolunteers = volunteerApp.getFilteredVolunteers();
        const conflicts = [];
        const updates = [];
        const newVolunteers = [];
        
        volunteers.forEach((volunteer, index) => {
            const targetRow = startRow + index;
            
            if (targetRow < currentVolunteers.length) {
                // Check for conflicts with existing data
                const existingVolunteer = currentVolunteers[targetRow];
                const conflict = this.detectConflicts(existingVolunteer, volunteer, startCol);
                
                if (conflict.hasConflict) {
                    conflicts.push({
                        row: targetRow + 1,
                        existing: existingVolunteer,
                        incoming: volunteer,
                        conflicts: conflict.fields
                    });
                } else {
                    // No conflict, safe to update
                    updates.push({ existing: existingVolunteer, incoming: volunteer, row: targetRow });
                }
            } else {
                // New row - validate before adding
                const validation = volunteer.validate();
                if (validation.isValid) {
                    newVolunteers.push(volunteer);
                } else {
                    conflicts.push({
                        row: targetRow + 1,
                        existing: null,
                        incoming: volunteer,
                        conflicts: validation.errors,
                        isValidationError: true
                    });
                }
            }
        });
        
        // Handle conflicts if any
        if (conflicts.length > 0) {
            this.showConflictResolutionDialog(conflicts, updates, newVolunteers, startRow);
        } else {
            // No conflicts, proceed with updates
            this.applyUpdates(updates, newVolunteers);
            ToastManager.show(`Pasted ${volunteers.length} record(s) successfully`, 'success');
        }
        
        // Highlight pasted area
        this.highlightPastedArea(startRow, volunteers.length);
    }
    
    // Detect conflicts between existing and incoming data
    detectConflicts(existing, incoming, startCol) {
        const conflicts = [];
        const columnMap = [
            'name', 'fatherHusbandName', 'age', 'isInitiated', 'initiatedBy', 
            'aadharNumber', 'address', 'mobileNumber', 'emergencyNumber', 
            'gender', 'badgeNumber', 'sewaStartDate', 'sewaEndDate', 'operation'
        ];
        
        // Check for duplicate mobile numbers
        if (incoming.mobileNumber && existing.mobileNumber !== incoming.mobileNumber) {
            const allVolunteers = volunteerApp.getAllVolunteers();
            const duplicateMobile = allVolunteers.find(v => 
                v.id !== existing.id && v.mobileNumber === incoming.mobileNumber
            );
            
            if (duplicateMobile) {
                conflicts.push(`Mobile number "${incoming.mobileNumber}" already exists`);
            }
        }
        
        // Check for duplicate badge numbers
        if (incoming.badgeNumber && existing.badgeNumber !== incoming.badgeNumber) {
            const allVolunteers = volunteerApp.getAllVolunteers();
            const duplicateBadge = allVolunteers.find(v => 
                v.id !== existing.id && v.badgeNumber === incoming.badgeNumber
            );
            
            if (duplicateBadge) {
                conflicts.push(`Badge number "${incoming.badgeNumber}" already exists`);
            }
        }
        
        // Check for overwriting existing data
        if (startCol === 0) {
            // Full row paste - check all non-empty fields
            columnMap.forEach(field => {
                if (existing[field] && incoming[field] && existing[field] !== incoming[field]) {
                    conflicts.push(`${field}: "${existing[field]}" → "${incoming[field]}"`);
                }
            });
        } else {
            // Single column paste
            const targetField = columnMap[startCol];
            if (targetField && existing[targetField] && incoming[targetField] && 
                existing[targetField] !== incoming[targetField]) {
                conflicts.push(`${targetField}: "${existing[targetField]}" → "${incoming[targetField]}"`);
            }
        }
        
        return {
            hasConflict: conflicts.length > 0,
            fields: conflicts
        };
    }
    
    // Show conflict resolution dialog
    showConflictResolutionDialog(conflicts, updates, newVolunteers, startRow) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
                <div class="flex items-center justify-between p-6 border-b">
                    <h3 class="text-xl font-semibold text-red-600">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        Data Conflicts Detected
                    </h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="p-6 overflow-y-auto max-h-96">
                    <p class="text-gray-600 mb-4">
                        Found ${conflicts.length} conflict(s) when pasting data. Choose how to resolve:
                    </p>
                    
                    <div class="space-y-4">
                        ${conflicts.map((conflict, index) => `
                            <div class="border rounded-lg p-4 ${conflict.isValidationError ? 'border-red-300 bg-red-50' : 'border-yellow-300 bg-yellow-50'}">
                                <div class="flex items-center justify-between mb-2">
                                    <h4 class="font-medium ${conflict.isValidationError ? 'text-red-800' : 'text-yellow-800'}">
                                        Row ${conflict.row} ${conflict.isValidationError ? '- Validation Error' : '- Data Conflict'}
                                    </h4>
                                    ${!conflict.isValidationError ? `
                                        <select id="resolution-${index}" class="px-3 py-1 border rounded">
                                            <option value="skip">Skip this row</option>
                                            <option value="overwrite">Overwrite existing</option>
                                            <option value="merge">Merge (keep existing where not empty)</option>
                                        </select>
                                    ` : ''}
                                </div>
                                
                                <div class="text-sm space-y-1">
                                    ${conflict.conflicts.map(c => `
                                        <div class="${conflict.isValidationError ? 'text-red-700' : 'text-yellow-700'}">${c}</div>
                                    `).join('')}
                                </div>
                                
                                ${conflict.existing ? `
                                    <div class="mt-2 grid grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <strong>Existing:</strong> ${conflict.existing.name || 'Unnamed'} 
                                            (${conflict.existing.volunteerId || 'No ID'})
                                        </div>
                                        <div>
                                            <strong>Incoming:</strong> ${conflict.incoming.name || 'Unnamed'} 
                                            (${conflict.incoming.volunteerId || 'No ID'})
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="flex justify-between items-center p-6 border-t bg-gray-50">
                    <div class="text-sm text-gray-600">
                        ${updates.length} record(s) ready to update, ${newVolunteers.length} new record(s) to add
                    </div>
                    <div class="flex gap-3">
                        <button onclick="this.closest('.fixed').remove()" 
                                class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                            Cancel
                        </button>
                        <button onclick="volunteerSpreadsheet.resolveConflicts(${JSON.stringify(conflicts).replace(/"/g, '&quot;')}, ${JSON.stringify(updates).replace(/"/g, '&quot;')}, ${JSON.stringify(newVolunteers).replace(/"/g, '&quot;')})" 
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Apply Changes
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Resolve conflicts based on user choices
    resolveConflicts(conflicts, updates, newVolunteers) {
        const resolvedUpdates = [...updates];
        
        conflicts.forEach((conflict, index) => {
            if (conflict.isValidationError) {
                // Skip validation errors
                return;
            }
            
            const resolution = document.getElementById(`resolution-${index}`)?.value || 'skip';
            
            switch (resolution) {
                case 'overwrite':
                    resolvedUpdates.push({
                        existing: conflict.existing,
                        incoming: conflict.incoming,
                        row: conflict.row - 1,
                        mode: 'overwrite'
                    });
                    break;
                    
                case 'merge':
                    resolvedUpdates.push({
                        existing: conflict.existing,
                        incoming: conflict.incoming,
                        row: conflict.row - 1,
                        mode: 'merge'
                    });
                    break;
                    
                case 'skip':
                default:
                    // Do nothing - skip this conflict
                    break;
            }
        });
        
        this.applyUpdates(resolvedUpdates, newVolunteers);
        
        // Close modal
        document.querySelector('.fixed.inset-0').remove();
        
        const totalProcessed = resolvedUpdates.length + newVolunteers.length;
        const skipped = conflicts.filter(c => !c.isValidationError).length - 
                       resolvedUpdates.filter(u => u.mode).length;
        
        ToastManager.show(
            `Processed ${totalProcessed} record(s)${skipped > 0 ? `, skipped ${skipped}` : ''}`, 
            'success'
        );
    }
    
    // Apply updates and new volunteers
    applyUpdates(updates, newVolunteers) {
        // Apply updates to existing volunteers
        updates.forEach(update => {
            if (update.mode === 'merge') {
                // Merge: only update empty fields
                Object.keys(update.incoming).forEach(key => {
                    if (update.incoming[key] && !update.existing[key]) {
                        volunteerApp.updateVolunteer(update.existing.id, key, update.incoming[key]);
                    }
                });
            } else {
                // Overwrite or normal update
                Object.keys(update.incoming).forEach(key => {
                    if (update.incoming[key]) {
                        volunteerApp.updateVolunteer(update.existing.id, key, update.incoming[key]);
                    }
                });
            }
        });
        
        // Add new volunteers
        if (newVolunteers.length > 0) {
            volunteerApp.addVolunteers(newVolunteers);
        } else {
            volunteerApp.applyFilters(); // Refresh display
        }
    }
    
    // Update volunteer from pasted data based on column
    updateVolunteerFromPaste(existingVolunteer, pastedData, startCol) {
        const columnMap = [
            'name', 'fatherHusbandName', 'age', 'isInitiated', 'initiatedBy', 
            'aadharNumber', 'address', 'mobileNumber', 'emergencyNumber', 
            'gender', 'badgeNumber', 'sewaStartDate', 'sewaEndDate', 'operation'
        ];
        
        // If pasting from first column, update all fields
        if (startCol === 0) {
            Object.keys(pastedData).forEach(key => {
                if (columnMap.includes(key) && pastedData[key] !== undefined) {
                    volunteerApp.updateVolunteer(existingVolunteer.id, key, pastedData[key]);
                }
            });
        } else {
            // Update specific column
            const targetField = columnMap[startCol];
            if (targetField && pastedData[targetField] !== undefined) {
                volunteerApp.updateVolunteer(existingVolunteer.id, targetField, pastedData[targetField]);
            }
        }
    }
    
    // Get cell position information
    getCellPosition(cell) {
        const row = cell.closest('tr');
        const rowIndex = Array.from(this.tbody.children).indexOf(row);
        const colIndex = Array.from(row.children).indexOf(cell) - 1; // -1 for row number
        
        return { row: rowIndex, col: colIndex };
    }
    
    // Highlight pasted area
    highlightPastedArea(startRow, rowCount) {
        setTimeout(() => {
            for (let i = startRow; i < startRow + rowCount; i++) {
                const row = this.tbody.children[i];
                if (row) {
                    row.classList.add('paste-preview');
                    setTimeout(() => {
                        row.classList.remove('paste-preview');
                    }, 2000);
                }
            }
        }, 100);
    }
    
    // Render the spreadsheet table
    render(volunteers) {
        // Always show at least 10 empty rows for Excel-like experience
        const minRows = 10;
        const displayVolunteers = [...volunteers];
        
        // Add empty rows if needed
        while (displayVolunteers.length < minRows) {
            displayVolunteers.push(new Volunteer({
                id: `empty-${displayVolunteers.length}`,
                isNew: false,
                isEmpty: true
            }));
        }
        
        // Add 5 more empty rows at the end for dynamic growth
        for (let i = 0; i < 5; i++) {
            displayVolunteers.push(new Volunteer({
                id: `extra-${volunteers.length + i}`,
                isNew: false,
                isEmpty: true
            }));
        }
        
        this.hideEmptyState(); // Always hide empty state
        this.tbody.innerHTML = displayVolunteers.map((volunteer, index) => 
            this.renderRow(volunteer, index + 1)
        ).join('');
        
        this.attachRowEventListeners();
        this.attachCellEventListeners();
    }
    
    // Render a single row
    renderRow(volunteer, rowNumber) {
        const isSelected = this.selectedRows.has(volunteer.id);
        const isEmpty = volunteer.isEmpty || false;
        const rowClass = `${isSelected ? 'row-selected' : ''} ${volunteer.isNew ? 'bg-blue-50' : ''} ${isEmpty ? 'empty-row' : ''}`;
        
        return `
            <tr class="${rowClass}" data-volunteer-id="${volunteer.id}" data-is-empty="${isEmpty}">
                <td class="row-number" onclick="volunteerSpreadsheet.toggleRowSelection(${volunteer.id}, event)">
                    ${rowNumber}
                </td>
                <td class="cell-container" data-col="0">
                    <input type="text" 
                           class="cell-input" 
                           value="${volunteer.name}"
                           placeholder="Enter full name"
                           onchange="volunteerApp.updateVolunteer(${volunteer.id}, 'name', this.value)"
                           onfocus="volunteerSpreadsheet.selectCell(this); volunteerSpreadsheet.handleEmptyRowActivation(${volunteer.id})"
                           onkeydown="KeyboardManager.handleKeyNavigation(event, this)">
                </td>
                <td class="cell-container" data-col="1">
                    <input type="text" 
                           class="cell-input" 
                           value="${volunteer.fatherHusbandName}"
                           placeholder="Enter father/husband name"
                           onchange="volunteerApp.updateVolunteer(${volunteer.id}, 'fatherHusbandName', this.value)"
                           onfocus="volunteerSpreadsheet.selectCell(this); volunteerSpreadsheet.handleEmptyRowActivation(${volunteer.id})"
                           onkeydown="KeyboardManager.handleKeyNavigation(event, this)">
                </td>
                <td class="cell-container" data-col="2">
                    <input type="number" 
                           class="cell-input" 
                           value="${volunteer.age}"
                           placeholder="Age"
                           min="1" max="120"
                           onchange="volunteerApp.updateVolunteer(${volunteer.id}, 'age', this.value)"
                           onfocus="volunteerSpreadsheet.selectCell(this); volunteerSpreadsheet.handleEmptyRowActivation(${volunteer.id})"
                           onkeydown="KeyboardManager.handleKeyNavigation(event, this)">
                </td>
                <td class="cell-container" data-col="3">
                    <select class="cell-input cell-select" 
                            onchange="volunteerApp.updateVolunteer(${volunteer.id}, 'isInitiated', this.value === 'true'); volunteerSpreadsheet.handleEmptyRowActivation(${volunteer.id})"
                            onfocus="volunteerSpreadsheet.selectCell(this)"
                            onkeydown="KeyboardManager.handleKeyNavigation(event, this)">
                        <option value="false" ${!volunteer.isInitiated ? 'selected' : ''}>FALSE</option>
                        <option value="true" ${volunteer.isInitiated ? 'selected' : ''}>TRUE</option>
                    </select>
                </td>
                <td class="cell-container" data-col="4">
                    <input type="text" 
                           class="cell-input" 
                           value="${volunteer.initiatedBy}"
                           placeholder="Initiated by"
                           onchange="volunteerApp.updateVolunteer(${volunteer.id}, 'initiatedBy', this.value)"
                           onfocus="volunteerSpreadsheet.selectCell(this); volunteerSpreadsheet.handleEmptyRowActivation(${volunteer.id})"
                           onkeydown="KeyboardManager.handleKeyNavigation(event, this)">
                </td>
                <td class="cell-container" data-col="5">
                    <input type="text" 
                           class="cell-input" 
                           value="${volunteer.aadharNumber}"
                           placeholder="12-digit Aadhar"
                           maxlength="12"
                           onchange="volunteerApp.updateVolunteer(${volunteer.id}, 'aadharNumber', this.value)"
                           onfocus="volunteerSpreadsheet.selectCell(this); volunteerSpreadsheet.handleEmptyRowActivation(${volunteer.id})"
                           onkeydown="KeyboardManager.handleKeyNavigation(event, this)">
                </td>
                <td class="cell-container" data-col="6">
                    <textarea class="cell-input" 
                              rows="1"
                              placeholder="Enter address"
                              onchange="volunteerApp.updateVolunteer(${volunteer.id}, 'address', this.value)"
                              onfocus="volunteerSpreadsheet.selectCell(this); volunteerSpreadsheet.handleEmptyRowActivation(${volunteer.id})"
                              onkeydown="KeyboardManager.handleKeyNavigation(event, this)">${volunteer.address}</textarea>
                </td>
                <td class="cell-container" data-col="7">
                    <input type="tel" 
                           class="cell-input" 
                           value="${volunteer.mobileNumber}"
                           placeholder="10-digit mobile"
                           maxlength="10"
                           onchange="volunteerApp.updateVolunteer(${volunteer.id}, 'mobileNumber', this.value)"
                           onfocus="volunteerSpreadsheet.selectCell(this); volunteerSpreadsheet.handleEmptyRowActivation(${volunteer.id})"
                           onkeydown="KeyboardManager.handleKeyNavigation(event, this)">
                </td>
                <td class="cell-container" data-col="8">
                    <input type="tel" 
                           class="cell-input" 
                           value="${volunteer.emergencyNumber}"
                           placeholder="Emergency contact"
                           maxlength="10"
                           onchange="volunteerApp.updateVolunteer(${volunteer.id}, 'emergencyNumber', this.value)"
                           onfocus="volunteerSpreadsheet.selectCell(this); volunteerSpreadsheet.handleEmptyRowActivation(${volunteer.id})"
                           onkeydown="KeyboardManager.handleKeyNavigation(event, this)">
                </td>
                <td class="cell-container" data-col="9">
                    <select class="cell-input cell-select" 
                            onchange="volunteerApp.updateVolunteer(${volunteer.id}, 'gender', this.value); volunteerSpreadsheet.handleEmptyRowActivation(${volunteer.id})"
                            onfocus="volunteerSpreadsheet.selectCell(this)"
                            onkeydown="KeyboardManager.handleKeyNavigation(event, this)">
                        <option value="">Select Gender</option>
                        <option value="Male" ${volunteer.gender === 'Male' ? 'selected' : ''}>Male</option>
                        <option value="Female" ${volunteer.gender === 'Female' ? 'selected' : ''}>Female</option>
                        <option value="Other" ${volunteer.gender === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                </td>
                <td class="cell-container" data-col="10">
                    <input type="text" 
                           class="cell-input" 
                           value="${volunteer.badgeNumber}"
                           placeholder="Badge number"
                           onchange="volunteerApp.updateVolunteer(${volunteer.id}, 'badgeNumber', this.value)"
                           onfocus="volunteerSpreadsheet.selectCell(this); volunteerSpreadsheet.handleEmptyRowActivation(${volunteer.id})"
                           onkeydown="KeyboardManager.handleKeyNavigation(event, this)">
                </td>
                <td class="cell-container" data-col="11">
                    <input type="date" 
                           class="cell-input" 
                           value="${volunteer.sewaStartDate}"
                           onchange="volunteerApp.updateVolunteer(${volunteer.id}, 'sewaStartDate', this.value)"
                           onfocus="volunteerSpreadsheet.selectCell(this); volunteerSpreadsheet.handleEmptyRowActivation(${volunteer.id})"
                           onkeydown="KeyboardManager.handleKeyNavigation(event, this)">
                </td>
                <td class="cell-container" data-col="12">
                    <input type="date" 
                           class="cell-input" 
                           value="${volunteer.sewaEndDate}"
                           onchange="volunteerApp.updateVolunteer(${volunteer.id}, 'sewaEndDate', this.value)"
                           onfocus="volunteerSpreadsheet.selectCell(this); volunteerSpreadsheet.handleEmptyRowActivation(${volunteer.id})"
                           onkeydown="KeyboardManager.handleKeyNavigation(event, this)">
                </td>
                <td class="cell-container" data-col="13">
                    <select class="cell-input cell-select" 
                            onchange="volunteerApp.updateVolunteer(${volunteer.id}, 'operation', this.value); volunteerSpreadsheet.handleEmptyRowActivation(${volunteer.id})"
                            onfocus="volunteerSpreadsheet.selectCell(this)"
                            onkeydown="KeyboardManager.handleKeyNavigation(event, this)">
                        <option value="Add" ${volunteer.operation === 'Add' ? 'selected' : ''}>Add</option>
                        <option value="Update" ${volunteer.operation === 'Update' ? 'selected' : ''}>Update</option>
                        <option value="Delete" ${volunteer.operation === 'Delete' ? 'selected' : ''}>Delete</option>
                    </select>
                </td>
                <td class="text-center">
                    ${!isEmpty ? `
                        <div class="flex items-center justify-center gap-1">
                            <button class="action-btn duplicate" 
                                    onclick="volunteerApp.duplicateVolunteer(${volunteer.id})"
                                    title="Duplicate volunteer">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="action-btn delete" 
                                    onclick="volunteerApp.deleteVolunteer(${volunteer.id})"
                                    title="Delete volunteer">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="action-btn more" 
                                    onclick="showRowMenu(event, ${volunteer.id})"
                                    title="More options">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                        </div>
                    ` : ''}
                </td>
            </tr>
        `;
    }
    
    // Handle activation of empty rows (convert to real volunteers)
    handleEmptyRowActivation(volunteerId) {
        const volunteerIdStr = String(volunteerId);
        if (volunteerIdStr.startsWith('empty-') || volunteerIdStr.startsWith('extra-')) {
            // Convert empty row to real volunteer
            const newVolunteer = new Volunteer({
                operation: 'Add',
                isNew: true
            });
            
            // Add to volunteers array
            volunteerApp.addVolunteers([newVolunteer]);
            
            // Focus on the new volunteer's first cell
            setTimeout(() => {
                const newRow = document.querySelector(`tr[data-volunteer-id="${newVolunteer.id}"]`);
                if (newRow) {
                    const firstInput = newRow.querySelector('input');
                    if (firstInput) firstInput.focus();
                }
            }, 100);
        }
    }
    
    // Render volunteer ID cell based on type
    renderVolunteerIdCell(volunteer) {
        if (volunteer.type === 'permanent') {
            return `
                <input type="text" 
                       class="cell-input" 
                       value="${volunteer.volunteerId}"
                       placeholder="Enter existing ID"
                       onchange="volunteerApp.updateVolunteer(${volunteer.id}, 'volunteerId', this.value)"
                       onfocus="volunteerSpreadsheet.selectCell(this)"
                       onkeydown="KeyboardManager.handleKeyNavigation(event, this)">
            `;
        } else {
            return `
                <div class="volunteer-id-display volunteer-id-temporary" 
                     onclick="volunteerSpreadsheet.selectCell(this)">
                    ${volunteer.volunteerId}
                </div>
            `;
        }
    }
    
    // Select a cell
    selectCell(element) {
        // Remove previous selection
        if (this.selectedCell) {
            this.selectedCell.classList.remove('cell-selected');
        }
        
        // Set new selection
        this.selectedCell = element.closest('.cell-container') || element;
        this.selectedCell.classList.add('cell-selected');
        
        // Show paste indicator
        this.showPasteIndicator();
    }
    
    // Show paste indicator for selected cell
    showPasteIndicator() {
        // Remove existing indicators
        document.querySelectorAll('.paste-indicator').forEach(el => el.remove());
        
        if (this.selectedCell) {
            const indicator = document.createElement('div');
            indicator.className = 'paste-indicator';
            indicator.innerHTML = '<i class="fas fa-paste"></i> Paste here (Ctrl+V)';
            
            const rect = this.selectedCell.getBoundingClientRect();
            indicator.style.position = 'fixed';
            indicator.style.top = (rect.bottom + 5) + 'px';
            indicator.style.left = rect.left + 'px';
            indicator.style.zIndex = '1000';
            
            document.body.appendChild(indicator);
            
            // Auto-hide after 3 seconds
            setTimeout(() => indicator.remove(), 3000);
        }
    }
    
    // Attach cell-specific event listeners
    attachCellEventListeners() {
        // Click anywhere to clear cell selection
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.cell-container') && !e.target.matches('.cell-input')) {
                if (this.selectedCell) {
                    this.selectedCell.classList.remove('cell-selected');
                    this.selectedCell = null;
                    document.querySelectorAll('.paste-indicator').forEach(el => el.remove());
                }
            }
        });
        
        // Add visual feedback for paste-ready cells
        this.tbody.querySelectorAll('.cell-container').forEach(cell => {
            cell.addEventListener('mouseenter', () => {
                if (!this.selectedCell) {
                    cell.classList.add('cell-hover');
                }
            });
            
            cell.addEventListener('mouseleave', () => {
                cell.classList.remove('cell-hover');
            });
        });
    }
    
    // Attach event listeners to rows
    attachRowEventListeners() {
        // Auto-resize textareas
        this.tbody.querySelectorAll('textarea').forEach(textarea => {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
        });
        
        // Format inputs on blur
        this.tbody.querySelectorAll('input[type="tel"]').forEach(input => {
            input.addEventListener('blur', () => {
                const validation = DataValidator.validateMobile(input.value);
                if (validation.isValid) {
                    input.classList.remove('cell-error');
                    input.classList.add('cell-success');
                } else if (input.value.trim()) {
                    input.classList.add('cell-error');
                    input.classList.remove('cell-success');
                }
            });
        });
        
        // Format Aadhar inputs
        this.tbody.querySelectorAll('input[placeholder*="XXXX"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    value = value.match(/.{1,4}/g).join('-');
                    if (value.length > 14) value = value.substr(0, 14);
                    e.target.value = value;
                }
            });
            
            input.addEventListener('blur', () => {
                const validation = DataValidator.validateAadhar(input.value);
                if (validation.isValid) {
                    input.classList.remove('cell-error');
                    input.classList.add('cell-success');
                } else if (input.value.trim()) {
                    input.classList.add('cell-error');
                    input.classList.remove('cell-success');
                }
            });
        });
    }
    
    // Toggle row selection
    toggleRowSelection(volunteerId, event) {
        const isCtrlClick = event.ctrlKey || event.metaKey;
        const isShiftClick = event.shiftKey;
        
        if (!isCtrlClick && !isShiftClick) {
            // Single selection - clear others
            this.selectedRows.clear();
            this.selectedRows.add(volunteerId);
        } else if (isCtrlClick) {
            // Toggle selection
            if (this.selectedRows.has(volunteerId)) {
                this.selectedRows.delete(volunteerId);
            } else {
                this.selectedRows.add(volunteerId);
            }
        } else if (isShiftClick && this.lastSelectedRow) {
            // Range selection
            const volunteers = volunteerApp.getFilteredVolunteers();
            const startIndex = volunteers.findIndex(v => v.id === this.lastSelectedRow);
            const endIndex = volunteers.findIndex(v => v.id === volunteerId);
            
            const minIndex = Math.min(startIndex, endIndex);
            const maxIndex = Math.max(startIndex, endIndex);
            
            for (let i = minIndex; i <= maxIndex; i++) {
                this.selectedRows.add(volunteers[i].id);
            }
        }
        
        this.lastSelectedRow = volunteerId;
        this.updateRowSelectionDisplay();
    }
    
    // Update visual display of selected rows
    updateRowSelectionDisplay() {
        this.tbody.querySelectorAll('tr').forEach(row => {
            const volunteerId = parseInt(row.dataset.volunteerId);
            if (this.selectedRows.has(volunteerId)) {
                row.classList.add('row-selected');
            } else {
                row.classList.remove('row-selected');
            }
        });
    }
    
    // Copy selected rows to clipboard (Excel format)
    async copySelectedRows() {
        if (this.selectedRows.size === 0) {
            ToastManager.show('No rows selected', 'warning');
            return;
        }
        
        const volunteers = volunteerApp.getAllVolunteers();
        const selectedVolunteers = volunteers.filter(v => this.selectedRows.has(v.id));
        
        // Copy to internal clipboard for internal paste
        ClipboardManager.copy(selectedVolunteers);
        
        // Also copy to system clipboard in Excel format
        await ClipboardManager.copyToClipboard(selectedVolunteers);
    }
    
    // Handle paste operations (both internal and Excel)
    async handlePaste(event) {
        // Try Excel paste first
        const excelVolunteers = await ClipboardManager.handleExcelPaste(event);
        
        // If no Excel data, try internal paste
        if (excelVolunteers.length === 0) {
            this.pasteRows();
        }
    }
    
    // Paste rows
    pasteRows() {
        const pastedVolunteers = ClipboardManager.paste();
        if (pastedVolunteers.length > 0) {
            volunteerApp.addVolunteers(pastedVolunteers);
        }
    }
    
    // Delete selected rows
    deleteSelectedRows() {
        if (this.selectedRows.size === 0) {
            ToastManager.show('No rows selected', 'warning');
            return;
        }
        
        const count = this.selectedRows.size;
        if (confirm(`Are you sure you want to delete ${count} volunteer record(s)?`)) {
            volunteerApp.deleteVolunteers(Array.from(this.selectedRows));
            this.selectedRows.clear();
            ToastManager.show(`Deleted ${count} volunteer record(s)`, 'success');
        }
    }
    
    // Fill down functionality
    fillDown() {
        if (this.selectedRows.size < 2) {
            ToastManager.show('Select at least 2 rows to fill down', 'warning');
            return;
        }
        
        const volunteers = volunteerApp.getAllVolunteers();
        const selectedVolunteers = volunteers
            .filter(v => this.selectedRows.has(v.id))
            .sort((a, b) => volunteers.indexOf(a) - volunteers.indexOf(b));
        
        if (selectedVolunteers.length < 2) return;
        
        const sourceVolunteer = selectedVolunteers[0];
        const fieldsToFill = ['address', 'event']; // Fields that make sense to fill down
        
        for (let i = 1; i < selectedVolunteers.length; i++) {
            fieldsToFill.forEach(field => {
                if (sourceVolunteer[field] && !selectedVolunteers[i][field]) {
                    volunteerApp.updateVolunteer(selectedVolunteers[i].id, field, sourceVolunteer[field]);
                }
            });
        }
        
        ToastManager.show(`Filled down to ${selectedVolunteers.length - 1} rows`, 'success');
    }
    
    // Show empty state
    showEmptyState() {
        this.tbody.innerHTML = '';
        this.emptyState.classList.remove('hidden');
    }
    
    // Hide empty state
    hideEmptyState() {
        this.emptyState.classList.add('hidden');
    }
    
    // Clear all selections
    clearSelection() {
        this.selectedRows.clear();
        this.updateRowSelectionDisplay();
        if (this.selectedCell) {
            this.selectedCell.classList.remove('cell-selected');
            this.selectedCell = null;
        }
    }
    
    // Select all visible rows
    selectAll() {
        const volunteers = volunteerApp.getFilteredVolunteers();
        volunteers.forEach(v => this.selectedRows.add(v.id));
        this.updateRowSelectionDisplay();
        ToastManager.show(`Selected ${volunteers.length} rows`, 'info');
    }
    
    // Get selected volunteer count
    getSelectedCount() {
        return this.selectedRows.size;
    }
}

// Initialize spreadsheet when DOM is loaded
let volunteerSpreadsheet;
document.addEventListener('DOMContentLoaded', () => {
    volunteerSpreadsheet = new VolunteerSpreadsheet('volunteerTableBody');
});
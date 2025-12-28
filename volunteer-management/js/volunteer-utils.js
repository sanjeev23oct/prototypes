/**
 * Volunteer Management Utilities
 * Helper functions for UI interactions, data manipulation, and common operations
 */

// Toast notification system
const ToastManager = {
    container: null,
    
    init() {
        this.container = document.getElementById('toastContainer');
    },
    
    show(message, type = 'success', duration = 3000) {
        if (!this.container) this.init();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getIcon(type);
        toast.innerHTML = `
            <i class="fas fa-${icon} mr-2"></i>
            <span>${message}</span>
        `;
        
        this.container.appendChild(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
        
        return toast;
    },
    
    getIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
};

// Local Storage Manager
const StorageManager = {
    STORAGE_KEY: 'volunteer_records',
    
    save(volunteers) {
        try {
            const data = {
                volunteers: volunteers,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    },
    
    load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) return null;
            
            const parsed = JSON.parse(data);
            return parsed.volunteers || [];
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return null;
        }
    },
    
    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
};

// CSV Export/Import utilities
const CSVManager = {
    // Export volunteers to CSV
    exportToCSV(volunteers, filename = null) {
        if (!volunteers || volunteers.length === 0) {
            ToastManager.show('No data to export', 'warning');
            return;
        }
        
        const headers = [
            'Name',
            'Father_Husband_Name', 
            'Age',
            'IsInitiated',
            'InitiatedBy',
            'AadharNumber',
            'Address',
            'MobileNumber',
            'EmergencyNumber',
            'Gender',
            'BadgeNumber',
            'SewaStartDate',
            'SewaEndDate',
            'Operation'
        ];
        
        const csvContent = [
            headers.join(','),
            ...volunteers.map(v => [
                `"${v.name}"`,
                `"${v.fatherHusbandName}"`,
                v.age,
                v.isInitiated,
                `"${v.initiatedBy}"`,
                v.aadharNumber,
                `"${v.address}"`,
                v.mobileNumber,
                v.emergencyNumber,
                v.gender,
                v.badgeNumber,
                v.sewaStartDate,
                v.sewaEndDate,
                v.operation
            ].join(','))
        ].join('\n');
        
        this.downloadCSV(csvContent, filename);
    },
    
    // Download CSV file
    downloadCSV(content, filename = null) {
        const defaultFilename = `volunteer_records_${new Date().toISOString().split('T')[0]}.csv`;
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || defaultFilename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
        ToastManager.show('Data exported successfully', 'success');
    },
    
    // Generate template CSV
    generateTemplate() {
        const templateContent = `Name,Father_Husband_Name,Age,IsInitiated,InitiatedBy,AadharNumber,Address,MobileNumber,EmergencyNumber,Gender,BadgeNumber,SewaStartDate,SewaEndDate,Operation
Dinesh Kumar,Chandra Mohan,45,FALSE,,475958374763,House 321 Model Town Delhi,9660007972,9033626304,Male,B001,2026-01-01,2026-01-20,Add
Rajesh Sharma,Shyam Lal,43,TRUE,Baba Ji,804016592037,L-267 Tilak Nagar Delhi,9538629342,9794791657,Male,B002,2026-01-01,2026-01-20,Add`;
        
        this.downloadCSV(templateContent, 'volunteer_template.csv');
    }
};

// Search and Filter utilities
const FilterManager = {
    // Filter volunteers by gender
    filterByGender(volunteers, gender) {
        if (gender === 'all') return volunteers;
        return volunteers.filter(v => v.gender === gender);
    },
    
    // Filter volunteers by initiation status
    filterByInitiation(volunteers, initiated) {
        if (initiated === 'all') return volunteers;
        return volunteers.filter(v => v.isInitiated === (initiated === 'true'));
    },
    
    // Search volunteers by text
    searchVolunteers(volunteers, searchTerm) {
        if (!searchTerm.trim()) return volunteers;
        
        const term = searchTerm.toLowerCase();
        return volunteers.filter(v => 
            v.name.toLowerCase().includes(term) ||
            v.fatherHusbandName.toLowerCase().includes(term) ||
            v.mobileNumber.includes(term) ||
            v.emergencyNumber.includes(term) ||
            v.badgeNumber.toLowerCase().includes(term) ||
            v.address.toLowerCase().includes(term) ||
            v.aadharNumber.includes(term) ||
            v.initiatedBy.toLowerCase().includes(term)
        );
    },
    
    // Apply multiple filters
    applyFilters(volunteers, filters) {
        let filtered = volunteers;
        
        if (filters.gender) {
            filtered = this.filterByGender(filtered, filters.gender);
        }
        
        if (filters.initiated) {
            filtered = this.filterByInitiation(filtered, filters.initiated);
        }
        
        if (filters.search) {
            filtered = this.searchVolunteers(filtered, filters.search);
        }
        
        return filtered;
    }
};

// Statistics calculator
const StatsCalculator = {
    // Calculate volunteer statistics
    calculateStats(volunteers) {
        const stats = {
            total: volunteers.length,
            initiated: volunteers.filter(v => v.isInitiated === true).length,
            notInitiated: volunteers.filter(v => v.isInitiated === false).length,
            badges: new Set(volunteers.map(v => v.badgeNumber).filter(b => b.trim())).size
        };
        
        return stats;
    },
    
    // Update statistics display
    updateStatsDisplay(volunteers) {
        const stats = this.calculateStats(volunteers);
        
        const elements = {
            total: document.getElementById('totalCount'),
            initiated: document.getElementById('initiatedCount'),
            notInitiated: document.getElementById('notInitiatedCount'),
            badges: document.getElementById('badgeCount')
        };
        
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                elements[key].textContent = stats[key];
            }
        });
    }
};

// Keyboard navigation utilities
const KeyboardManager = {
    // Handle keyboard navigation in spreadsheet
    handleKeyNavigation(event, currentCell) {
        const table = currentCell.closest('table');
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const currentRow = currentCell.closest('tr');
        const currentRowIndex = rows.indexOf(currentRow);
        const cells = Array.from(currentRow.querySelectorAll('input, select, textarea'));
        const currentCellIndex = cells.indexOf(currentCell);
        
        switch (event.key) {
            case 'Tab':
                // Handle tab navigation
                if (!event.shiftKey && currentCellIndex < cells.length - 1) {
                    event.preventDefault();
                    cells[currentCellIndex + 1].focus();
                } else if (event.shiftKey && currentCellIndex > 0) {
                    event.preventDefault();
                    cells[currentCellIndex - 1].focus();
                }
                break;
                
            case 'Enter':
                // Move to next row, same column
                event.preventDefault();
                if (currentRowIndex < rows.length - 1) {
                    const nextRowCells = Array.from(rows[currentRowIndex + 1].querySelectorAll('input, select, textarea'));
                    if (nextRowCells[currentCellIndex]) {
                        nextRowCells[currentCellIndex].focus();
                    }
                }
                break;
                
            case 'ArrowUp':
                // Move to previous row, same column
                if (currentRowIndex > 0) {
                    const prevRowCells = Array.from(rows[currentRowIndex - 1].querySelectorAll('input, select, textarea'));
                    if (prevRowCells[currentCellIndex]) {
                        prevRowCells[currentCellIndex].focus();
                    }
                }
                break;
                
            case 'ArrowDown':
                // Move to next row, same column
                if (currentRowIndex < rows.length - 1) {
                    const nextRowCells = Array.from(rows[currentRowIndex + 1].querySelectorAll('input, select, textarea'));
                    if (nextRowCells[currentCellIndex]) {
                        nextRowCells[currentCellIndex].focus();
                    }
                }
                break;
        }
    }
};

// Enhanced Clipboard utilities for Excel-like functionality
const ClipboardManager = {
    copiedData: null,
    
    // Copy volunteer data (internal copy)
    copy(volunteers) {
        this.copiedData = volunteers.map(v => ({ ...v }));
        ToastManager.show(`Copied ${volunteers.length} volunteer(s)`, 'info');
    },
    
    // Paste volunteer data (internal paste)
    paste() {
        if (!this.copiedData || this.copiedData.length === 0) {
            ToastManager.show('No data to paste', 'warning');
            return [];
        }
        
        // Create new volunteers with new IDs
        const pastedVolunteers = this.copiedData.map(data => {
            const newVolunteer = new Volunteer({
                ...data,
                id: Date.now() + Math.random(),
                isNew: true
            });
            
            // Generate new temp ID if temporary volunteer
            if (newVolunteer.type === 'temporary') {
                newVolunteer.volunteerId = IDGenerator.generateTempId();
            }
            
            return newVolunteer;
        });
        
        ToastManager.show(`Pasted ${pastedVolunteers.length} volunteer(s)`, 'success');
        return pastedVolunteers;
    },
    
    // Parse clipboard data from Excel/external sources
    async parseClipboardData(clipboardData) {
        try {
            let text = '';
            
            // Try to get text from clipboard
            if (clipboardData && clipboardData.getData) {
                text = clipboardData.getData('text/plain') || clipboardData.getData('text');
            } else if (navigator.clipboard && navigator.clipboard.readText) {
                text = await navigator.clipboard.readText();
            }
            
            if (!text.trim()) {
                ToastManager.show('No text data found in clipboard', 'warning');
                return [];
            }
            
            return this.parseTabDelimitedData(text);
        } catch (error) {
            console.error('Error reading clipboard:', error);
            ToastManager.show('Could not read clipboard data', 'error');
            return [];
        }
    },
    
    // Parse tab-delimited data (Excel format)
    parseTabDelimitedData(text) {
        const lines = text.trim().split('\n');
        const volunteers = [];
        
        // Expected column order: Name, Father/Husband Name, Age, IsInitiated, InitiatedBy, AadharNumber, Address, MobileNumber, EmergencyNumber, Gender, BadgeNumber, SewaStartDate, SewaEndDate, Operation
        const columnMapping = {
            0: 'name',
            1: 'fatherHusbandName', 
            2: 'age',
            3: 'isInitiated',
            4: 'initiatedBy',
            5: 'aadharNumber',
            6: 'address',
            7: 'mobileNumber',
            8: 'emergencyNumber',
            9: 'gender',
            10: 'badgeNumber',
            11: 'sewaStartDate',
            12: 'sewaEndDate',
            13: 'operation'
        };
        
        lines.forEach((line, index) => {
            const cells = line.split('\t').map(cell => cell.trim());
            
            // Skip empty lines
            if (cells.length === 1 && !cells[0]) return;
            
            const volunteerData = {
                id: Date.now() + Math.random() + index,
                isNew: true
            };
            
            // Map cells to volunteer properties
            cells.forEach((cell, cellIndex) => {
                const property = columnMapping[cellIndex];
                if (property) {
                    if (property === 'isInitiated') {
                        volunteerData[property] = cell.toLowerCase() === 'true';
                    } else if (property === 'age') {
                        volunteerData[property] = parseInt(cell) || '';
                    } else {
                        volunteerData[property] = cell;
                    }
                }
            });
            
            // Set defaults
            if (!volunteerData.operation) {
                volunteerData.operation = 'Add';
            }
            
            // Only add if we have at least a name
            if (volunteerData.name) {
                volunteers.push(new Volunteer(volunteerData));
            }
        });
        
        return volunteers;
    },
    
    // Handle paste from Excel with smart column detection
    async handleExcelPaste(event) {
        event.preventDefault();
        
        const clipboardData = event.clipboardData || window.clipboardData;
        const volunteers = await this.parseClipboardData(clipboardData);
        
        if (volunteers.length > 0) {
            volunteerApp.addVolunteers(volunteers);
            ToastManager.show(`Pasted ${volunteers.length} volunteer(s) from Excel`, 'success');
        }
        
        return volunteers;
    },
    
    // Copy data to clipboard in Excel format
    async copyToClipboard(volunteers) {
        const headers = ['Name', 'Father_Husband_Name', 'Age', 'IsInitiated', 'InitiatedBy', 'AadharNumber', 'Address', 'MobileNumber', 'EmergencyNumber', 'Gender', 'BadgeNumber', 'SewaStartDate', 'SewaEndDate', 'Operation'];
        const rows = volunteers.map(v => [
            v.name,
            v.fatherHusbandName,
            v.age,
            v.isInitiated,
            v.initiatedBy,
            v.aadharNumber,
            v.address,
            v.mobileNumber,
            v.emergencyNumber,
            v.gender,
            v.badgeNumber,
            v.sewaStartDate,
            v.sewaEndDate,
            v.operation
        ]);
        
        const tsvData = [headers, ...rows]
            .map(row => row.join('\t'))
            .join('\n');
        
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(tsvData);
                ToastManager.show(`Copied ${volunteers.length} volunteer(s) to clipboard`, 'success');
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = tsvData;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                ToastManager.show(`Copied ${volunteers.length} volunteer(s) to clipboard`, 'success');
            }
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            ToastManager.show('Could not copy to clipboard', 'error');
        }
    },
    
    // Clear clipboard
    clear() {
        this.copiedData = null;
    }
};

// Initialize utilities when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ToastManager.init();
});
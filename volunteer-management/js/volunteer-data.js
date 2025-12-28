/**
 * Volunteer Data Management
 * Handles data models, validation, and business rules
 */

// Volunteer data structure
class Volunteer {
    constructor(data = {}) {
        this.id = data.id || Date.now() + Math.random();
        this.name = data.name || '';
        this.fatherHusbandName = data.fatherHusbandName || '';
        this.age = data.age || '';
        this.isInitiated = data.isInitiated || false;
        this.initiatedBy = data.initiatedBy || '';
        this.aadharNumber = data.aadharNumber || '';
        this.address = data.address || '';
        this.mobileNumber = data.mobileNumber || '';
        this.emergencyNumber = data.emergencyNumber || '';
        this.gender = data.gender || '';
        this.badgeNumber = data.badgeNumber || '';
        this.sewaStartDate = data.sewaStartDate || '';
        this.sewaEndDate = data.sewaEndDate || '';
        this.operation = data.operation || 'Add';
        this.isNew = data.isNew || false;
        this.selected = false;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    // Update volunteer data
    update(field, value) {
        this[field] = value;
        this.updatedAt = new Date().toISOString();
        this.isNew = false;
    }

    // Validate volunteer data
    validate() {
        const errors = [];
        
        if (!this.name.trim()) {
            errors.push('Name is required');
        }
        
        if (!this.mobileNumber.trim()) {
            errors.push('Mobile number is required');
        } else if (!/^\d{10}$/.test(this.mobileNumber.replace(/\D/g, ''))) {
            errors.push('Mobile number must be 10 digits');
        }
        
        if (this.emergencyNumber && !/^\d{10}$/.test(this.emergencyNumber.replace(/\D/g, ''))) {
            errors.push('Emergency number must be 10 digits');
        }
        
        if (this.aadharNumber && !/^\d{12}$/.test(this.aadharNumber.replace(/\D/g, ''))) {
            errors.push('Aadhar number must be 12 digits');
        }
        
        if (this.age && (isNaN(this.age) || this.age < 1 || this.age > 120)) {
            errors.push('Age must be between 1 and 120');
        }
        
        if (this.gender && !['Male', 'Female', 'Other'].includes(this.gender)) {
            errors.push('Gender must be Male, Female, or Other');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Convert to export format
    toExportFormat() {
        return {
            'Name': this.name,
            'Father_Husband_Name': this.fatherHusbandName,
            'Age': this.age,
            'IsInitiated': this.isInitiated,
            'InitiatedBy': this.initiatedBy,
            'AadharNumber': this.aadharNumber,
            'Address': this.address,
            'MobileNumber': this.mobileNumber,
            'EmergencyNumber': this.emergencyNumber,
            'Gender': this.gender,
            'BadgeNumber': this.badgeNumber,
            'SewaStartDate': this.sewaStartDate,
            'SewaEndDate': this.sewaEndDate,
            'Operation': this.operation
        };
    }
}

// Business Rules and Constants
const VOLUNTEER_RULES = {
    /**
     * BUSINESS RULE: Volunteer Management
     * - All volunteers have comprehensive profile information
     * - Badge numbers are auto-generated or manually assigned
     * - Sewa dates track service periods
     */
    
    // Field validation patterns
    PATTERNS: {
        MOBILE: /^\d{10}$/,
        AADHAR: /^\d{12}$/,
        BADGE: /^[A-Z0-9-]+$/
    },
    
    GENDERS: ['Male', 'Female', 'Other'],
    OPERATIONS: ['Add', 'Update', 'Delete']
};

// Sample data for demonstration
const SAMPLE_VOLUNTEERS = [
    // Empty - ready for user data
];

// Data validation utilities
const DataValidator = {
    // Validate mobile number
    validateMobile(mobile) {
        const cleaned = mobile.replace(/\D/g, '');
        return {
            isValid: VOLUNTEER_RULES.PATTERNS.MOBILE.test(cleaned),
            cleaned: cleaned,
            formatted: cleaned.length === 10 ? 
                `${cleaned.slice(0,3)}-${cleaned.slice(3,6)}-${cleaned.slice(6)}` : cleaned
        };
    },

    // Validate Aadhar number
    validateAadhar(aadhar) {
        const cleaned = aadhar.replace(/\D/g, '');
        return {
            isValid: cleaned.length === 12,
            cleaned: cleaned,
            formatted: cleaned.length === 12 ? 
                `${cleaned.slice(0,4)}-${cleaned.slice(4,8)}-${cleaned.slice(8)}` : cleaned
        };
    },

    // Validate age
    validateAge(age) {
        const numAge = parseInt(age);
        return {
            isValid: !isNaN(numAge) && numAge >= 1 && numAge <= 120,
            value: numAge
        };
    },

    // Validate gender
    validateGender(gender) {
        return {
            isValid: VOLUNTEER_RULES.GENDERS.includes(gender),
            message: gender ? 'Must be Male, Female, or Other' : 'Gender is required'
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Volunteer, VOLUNTEER_RULES, SAMPLE_VOLUNTEERS, DataValidator };
}
/**
 * Internationalization (i18n) Support
 * English and Hindi translations
 */

const i18n = {
    currentLang: 'en',
    
    translations: {
        en: {
            // App Title
            appTitle: 'RSSB Bhati Digging Approval System',
            appSubtitle: 'Infrastructure Protection & Coordination',
            
            // Common
            workRequests: 'Work Requests',
            newRequest: 'New Request',
            loadSample: 'Load Sample',
            allStatus: 'All Status',
            allDepartments: 'All Departments',
            pending: 'Pending',
            approved: 'Approved',
            active: 'Active',
            completed: 'Completed',
            rejected: 'Rejected',
            
            // Form Labels
            workTitle: 'Work Title',
            requestingDept: 'Requesting Department',
            workType: 'Work Type',
            location: 'Location',
            addNewLocation: 'Add New Location',
            startDateTime: 'Start Date & Time',
            endDateTime: 'End Date & Time',
            workDescription: 'Work Description',
            contactPerson: 'Contact Person',
            contactName: 'Contact Name',
            contactNumber: 'Contact Number',
            attachments: 'Attachments',
            uploadFiles: 'Upload Files (Images, Videos, AutoCAD)',
            capturePhoto: 'Capture Geotagged Photo',
            departmentsToNotify: 'Departments to Notify',
            safetyMeasures: 'Safety Measures & Precautions',
            
            // Buttons
            cancel: 'Cancel',
            submit: 'Submit Request',
            next: 'Next',
            previous: 'Previous',
            edit: 'Edit',
            approve: 'Approve',
            reject: 'Reject',
            close: 'Close',
            selectAll: 'Select All',
            clearAll: 'Clear All',
            
            // Messages
            selectDepartment: 'Select Department',
            selectLocation: 'Select Location',
            briefDescription: 'Brief description of work',
            detailedDescription: 'Detailed description of digging work to be performed',
            listSafetyMeasures: 'List safety measures and precautions to be taken',
            
            // Placeholders
            enterWorkTitle: 'Enter work title',
            enterDescription: 'Enter detailed description',
            enterContactName: 'Enter contact person name',
            enterContactNumber: 'Enter contact number',
            
            // Work Type
            diggingWork: 'Excavation/Digging Work',
            
            // Validation
            required: 'This field is required',
            minLength: 'Minimum length is {min} characters',
            
            // Table Headers
            requestId: 'Request ID',
            department: 'Department',
            actions: 'Actions',
            status: 'Status'
        },
        
        hi: {
            // App Title
            appTitle: 'आरएसएसबी भाटी खुदाई अनुमोदन प्रणाली',
            appSubtitle: 'बुनियादी ढांचा संरक्षण और समन्वय',
            
            // Common
            workRequests: 'कार्य अनुरोध',
            newRequest: 'नया अनुरोध',
            loadSample: 'नमूना लोड करें',
            allStatus: 'सभी स्थिति',
            allDepartments: 'सभी विभाग',
            pending: 'लंबित',
            approved: 'स्वीकृत',
            active: 'सक्रिय',
            completed: 'पूर्ण',
            rejected: 'अस्वीकृत',
            
            // Form Labels
            workTitle: 'कार्य शीर्षक',
            requestingDept: 'अनुरोध करने वाला विभाग',
            workType: 'कार्य प्रकार',
            location: 'स्थान',
            addNewLocation: 'नया स्थान जोड़ें',
            startDateTime: 'प्रारंभ तिथि और समय',
            endDateTime: 'समाप्ति तिथि और समय',
            workDescription: 'कार्य विवरण',
            contactPerson: 'संपर्क व्यक्ति',
            contactName: 'संपर्क नाम',
            contactNumber: 'संपर्क नंबर',
            attachments: 'संलग्नक',
            uploadFiles: 'फ़ाइलें अपलोड करें (चित्र, वीडियो, ऑटोकैड)',
            capturePhoto: 'जियोटैग फोटो कैप्चर करें',
            departmentsToNotify: 'सूचित करने के लिए विभाग',
            safetyMeasures: 'सुरक्षा उपाय और सावधानियां',
            
            // Buttons
            cancel: 'रद्द करें',
            submit: 'अनुरोध जमा करें',
            next: 'अगला',
            previous: 'पिछला',
            edit: 'संपादित करें',
            approve: 'स्वीकृत करें',
            reject: 'अस्वीकार करें',
            close: 'बंद करें',
            selectAll: 'सभी चुनें',
            clearAll: 'सभी साफ़ करें',
            
            // Messages
            selectDepartment: 'विभाग चुनें',
            selectLocation: 'स्थान चुनें',
            briefDescription: 'कार्य का संक्षिप्त विवरण',
            detailedDescription: 'किए जाने वाले खुदाई कार्य का विस्तृत विवरण',
            listSafetyMeasures: 'सुरक्षा उपायों और सावधानियों की सूची बनाएं',
            
            // Placeholders
            enterWorkTitle: 'कार्य शीर्षक दर्ज करें',
            enterDescription: 'विस्तृत विवरण दर्ज करें',
            enterContactName: 'संपर्क व्यक्ति का नाम दर्ज करें',
            enterContactNumber: 'संपर्क नंबर दर्ज करें',
            
            // Work Type
            diggingWork: 'खुदाई/उत्खनन कार्य',
            
            // Validation
            required: 'यह फ़ील्ड आवश्यक है',
            minLength: 'न्यूनतम लंबाई {min} वर्ण है',
            
            // Table Headers
            requestId: 'अनुरोध आईडी',
            department: 'विभाग',
            actions: 'कार्रवाई',
            status: 'स्थिति'
        }
    },
    
    /**
     * Get translation for a key
     */
    t(key) {
        return this.translations[this.currentLang][key] || key;
    },
    
    /**
     * Switch language
     */
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.error(`Language ${lang} not supported`);
            return;
        }
        
        this.currentLang = lang;
        this.updateUI();
        
        // Save preference
        if (typeof Utils !== 'undefined') {
            Utils.storage.set('language', lang);
        }
    },
    
    /**
     * Update UI with current language
     */
    updateUI() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });
        
        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
        
        // Update language button states
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-100', 'text-blue-700');
        });
        
        const activeBtn = document.getElementById(`lang${this.currentLang.charAt(0).toUpperCase() + this.currentLang.slice(1)}Btn`);
        if (activeBtn) {
            activeBtn.classList.add('active', 'bg-blue-100', 'text-blue-700');
        }
    },
    
    /**
     * Initialize i18n
     */
    init() {
        // Load saved language preference
        if (typeof Utils !== 'undefined') {
            const savedLang = Utils.storage.get('language');
            if (savedLang) {
                this.currentLang = savedLang;
            }
        }
        
        this.updateUI();
    }
};

/**
 * Global function to switch language
 */
function switchLanguage(lang) {
    i18n.setLanguage(lang);
    
    // Trigger custom event for other components to react
    const event = new CustomEvent('languageChanged', { detail: { language: lang } });
    document.dispatchEvent(event);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = i18n;
}

console.log('✓ i18n.js loaded successfully');

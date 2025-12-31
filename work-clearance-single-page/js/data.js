/**
 * Mock Data for Single Page Work Clearance System
 * Realistic data for RSSB Bhati Spiritual Organization
 */

const MockData = {
    // Departments in the organization
    departments: [
        { id: 'maintenance', name: 'Maintenance Department', head: 'Rajesh Kumar', contact: '+91-9876543210' },
        { id: 'construction', name: 'Construction Department', head: 'Suresh Patel', contact: '+91-9876543211' },
        { id: 'landscaping', name: 'Landscaping Department', head: 'Priya Sharma', contact: '+91-9876543212' },
        { id: 'electrical', name: 'Electrical Department', head: 'Amit Singh', contact: '+91-9876543213' },
        { id: 'plumbing', name: 'Plumbing Department', head: 'Ravi Gupta', contact: '+91-9876543214' },
        { id: 'security', name: 'Security Department', head: 'Vikram Yadav', contact: '+91-9876543215' },
        { id: 'it', name: 'IT Department', head: 'Neha Agarwal', contact: '+91-9876543216' },
        { id: 'transport', name: 'Transport Department', head: 'Manoj Verma', contact: '+91-9876543217' }
    ],

    // Types of work that can be performed
    workTypes: [
        { id: 'digging', name: 'Excavation/Digging', riskLevel: 'high', requiresApproval: ['infrastructure', 'safety'] },
        { id: 'electrical', name: 'Electrical Work', riskLevel: 'medium', requiresApproval: ['electrical', 'safety'] },
        { id: 'plumbing', name: 'Plumbing Work', riskLevel: 'medium', requiresApproval: ['infrastructure'] },
        { id: 'construction', name: 'Construction Work', riskLevel: 'high', requiresApproval: ['infrastructure', 'safety', 'admin'] },
        { id: 'maintenance', name: 'General Maintenance', riskLevel: 'low', requiresApproval: ['supervisor'] },
        { id: 'landscaping', name: 'Landscaping Work', riskLevel: 'low', requiresApproval: ['supervisor'] },
        { id: 'road-work', name: 'Road/Path Work', riskLevel: 'medium', requiresApproval: ['infrastructure', 'transport'] },
        { id: 'telecom', name: 'Telecom Installation', riskLevel: 'medium', requiresApproval: ['it', 'infrastructure'] }
    ],

    // Infrastructure types that could be affected
    infrastructureTypes: [
        { id: 'fiber', name: 'Fiber Optic Cables', color: '#8b5cf6', critical: true },
        { id: 'power', name: 'Power Lines', color: '#f59e0b', critical: true },
        { id: 'water', name: 'Water Pipes', color: '#06b6d4', critical: true },
        { id: 'gas', name: 'Gas Lines', color: '#ef4444', critical: true },
        { id: 'telecom', name: 'Telecom Cables', color: '#10b981', critical: false },
        { id: 'drainage', name: 'Drainage System', color: '#6b7280', critical: false }
    ],

    // Campus locations
    locations: [
        { id: 'main-hall', name: 'Main Satsang Hall', zone: 'central' },
        { id: 'admin-block', name: 'Administrative Block', zone: 'north' },
        { id: 'guest-house', name: 'Guest House Complex', zone: 'east' },
        { id: 'kitchen-area', name: 'Community Kitchen', zone: 'west' },
        { id: 'parking-area', name: 'Main Parking Area', zone: 'south' },
        { id: 'garden-area', name: 'Garden & Landscaping', zone: 'east' },
        { id: 'security-gate', name: 'Main Security Gate', zone: 'south' },
        { id: 'library', name: 'Spiritual Library', zone: 'north' },
        { id: 'meditation-hall', name: 'Meditation Hall', zone: 'central' },
        { id: 'service-area', name: 'Service Area', zone: 'west' }
    ],

    // Priority levels with descriptions
    priorities: [
        { 
            id: 'low', 
            name: 'Low', 
            description: 'Routine work', 
            color: '#10b981',
            icon: 'fas fa-circle'
        },
        { 
            id: 'medium', 
            name: 'Medium', 
            description: 'Standard priority', 
            color: '#f59e0b',
            icon: 'fas fa-circle'
        },
        { 
            id: 'high', 
            name: 'High', 
            description: 'Important work', 
            color: '#f97316',
            icon: 'fas fa-circle'
        },
        { 
            id: 'urgent', 
            name: 'Urgent', 
            description: 'Emergency', 
            color: '#ef4444',
            icon: 'fas fa-exclamation-circle'
        }
    ],

    // Generate safety measures based on risk level
    generateSafetyMeasures: (riskLevel) => {
        const baseMeasures = [
            'Wear appropriate PPE (Personal Protective Equipment)',
            'Ensure proper ventilation in work area',
            'Keep emergency contact numbers readily available',
            'Follow standard operating procedures'
        ];

        const mediumRiskMeasures = [
            'Install safety barriers around work area',
            'Conduct safety briefing before work begins',
            'Have first aid kit available on site',
            'Ensure proper lighting in work area'
        ];

        const highRiskMeasures = [
            'Obtain infrastructure clearance before digging',
            'Use underground utility detection equipment',
            'Have emergency response team on standby',
            'Conduct risk assessment and safety audit',
            'Install warning signs and traffic control measures',
            'Coordinate with all affected departments'
        ];

        let measures = [...baseMeasures];
        if (riskLevel === 'medium' || riskLevel === 'high') {
            measures = [...measures, ...mediumRiskMeasures];
        }
        if (riskLevel === 'high') {
            measures = [...measures, ...highRiskMeasures];
        }

        return measures;
    },

    // Generate random Indian names
    generateRandomName: () => {
        const firstNames = [
            'Rajesh', 'Priya', 'Amit', 'Sunita', 'Vikram', 'Neha', 'Suresh', 'Kavita',
            'Manoj', 'Pooja', 'Ravi', 'Meera', 'Anil', 'Deepika', 'Sanjay', 'Rekha'
        ];
        const lastNames = [
            'Kumar', 'Sharma', 'Patel', 'Singh', 'Gupta', 'Yadav', 'Agarwal', 'Verma'
        ];
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        return `${firstName} ${lastName}`;
    },

    // Get work type by ID
    getWorkType: (id) => {
        return MockData.workTypes.find(type => type.id === id);
    },

    // Get department by ID
    getDepartment: (id) => {
        return MockData.departments.find(dept => dept.id === id);
    },

    // Get location by ID
    getLocation: (id) => {
        return MockData.locations.find(loc => loc.id === id);
    },

    // Get priority by ID
    getPriority: (id) => {
        return MockData.priorities.find(priority => priority.id === id);
    },

    // Get infrastructure type by ID
    getInfrastructureType: (id) => {
        return MockData.infrastructureTypes.find(infra => infra.id === id);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockData;
}
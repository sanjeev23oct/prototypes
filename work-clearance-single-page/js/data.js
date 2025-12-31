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
    // Sample data templates for quick form population
    sampleRequests: [
        {
            title: "Fiber Cable Installation - Main Hall Area",
            department: "it",
            workType: "telecom",
            priority: "high",
            location: "main-hall",
            description: "Installation of new fiber optic cables to improve network connectivity in the main satsang hall. This work involves trenching along the pathway and connecting to existing infrastructure. Coordination with multiple departments required to ensure no disruption to daily activities.",
            startDate: () => {
                const date = new Date();
                date.setDate(date.getDate() + 2);
                return date.toISOString().slice(0, 16);
            },
            endDate: () => {
                const date = new Date();
                date.setDate(date.getDate() + 4);
                return date.toISOString().slice(0, 16);
            },
            duration: "16",
            infrastructureAffected: ["fiber", "power", "telecom"],
            notifyDepartments: ["electrical", "security", "maintenance", "construction"],
            safetyMeasures: "Use underground utility detection equipment before digging. Install safety barriers around work area. Coordinate with electrical department for power line locations. Have emergency response team contact ready.",
            emergencyContact: "+91-9876543216",
            requesterName: "Neha Agarwal",
            notes: "Work must be completed before weekend satsang. Please coordinate with security for access permissions."
        },
        {
            title: "Emergency Electrical Panel Upgrade - Admin Block",
            department: "electrical",
            workType: "electrical",
            priority: "urgent",
            location: "admin-block",
            description: "Urgent replacement of aging electrical panel in administrative block due to safety concerns. Work requires temporary power shutdown and coordination with all departments using the building. Critical infrastructure work that cannot be delayed.",
            startDate: () => {
                const date = new Date();
                date.setDate(date.getDate() + 1);
                return date.toISOString().slice(0, 16);
            },
            endDate: () => {
                const date = new Date();
                date.setDate(date.getDate() + 1);
                date.setHours(date.getHours() + 6);
                return date.toISOString().slice(0, 16);
            },
            duration: "6",
            infrastructureAffected: ["power", "telecom"],
            notifyDepartments: ["it", "security", "maintenance", "transport"],
            safetyMeasures: "Complete power shutdown required. Use lockout/tagout procedures. Have backup generator ready for critical systems. Ensure all personnel are aware of power outage schedule.",
            emergencyContact: "+91-9876543213",
            requesterName: "Amit Singh",
            notes: "Backup power arrangements made for security systems. IT department has been notified about server shutdown procedures."
        },
        {
            title: "Garden Renovation - Meditation Hall Surroundings",
            department: "landscaping",
            workType: "landscaping",
            priority: "medium",
            location: "meditation-hall",
            description: "Comprehensive landscaping renovation around the meditation hall including new plant installations, pathway improvements, and irrigation system upgrades. Work involves soil preparation, plant installation, and minor excavation for irrigation pipes.",
            startDate: () => {
                const date = new Date();
                date.setDate(date.getDate() + 7);
                return date.toISOString().slice(0, 16);
            },
            endDate: () => {
                const date = new Date();
                date.setDate(date.getDate() + 10);
                return date.toISOString().slice(0, 16);
            },
            duration: "24",
            infrastructureAffected: ["water", "drainage"],
            notifyDepartments: ["maintenance", "security", "plumbing"],
            safetyMeasures: "Check for underground utilities before digging. Use proper tools for soil work. Ensure pathway safety during work hours. Coordinate with meditation schedule to minimize noise.",
            emergencyContact: "+91-9876543212",
            requesterName: "Priya Sharma",
            notes: "Work scheduled to avoid meditation hours (6 AM - 8 AM and 6 PM - 8 PM). Special care needed for existing mature trees."
        }
    ],

    // Department user profiles for impersonation
    departmentUsers: [
        {
            id: "electrical_head",
            name: "Amit Singh",
            department: "electrical",
            role: "Department Head",
            permissions: ["approve_electrical", "view_all_electrical", "create_requests"],
            avatar: "👨‍🔧"
        },
        {
            id: "security_head", 
            name: "Vikram Yadav",
            department: "security",
            role: "Security Chief",
            permissions: ["approve_security", "view_all_security", "emergency_override"],
            avatar: "👮‍♂️"
        },
        {
            id: "it_head",
            name: "Neha Agarwal", 
            department: "it",
            role: "IT Manager",
            permissions: ["approve_it", "view_all_it", "infrastructure_access"],
            avatar: "👩‍💻"
        },
        {
            id: "maintenance_head",
            name: "Rajesh Kumar",
            department: "maintenance", 
            role: "Maintenance Supervisor",
            permissions: ["approve_maintenance", "view_all_maintenance", "facility_access"],
            avatar: "🔧"
        },
        {
            id: "construction_head",
            name: "Suresh Patel",
            department: "construction",
            role: "Construction Manager", 
            permissions: ["approve_construction", "view_all_construction", "site_access"],
            avatar: "👷‍♂️"
        },
        {
            id: "admin_director",
            name: "Dr. Rajesh Gupta",
            department: "administration",
            role: "Campus Director",
            permissions: ["approve_all", "view_all", "override_all", "policy_changes"],
            avatar: "👨‍💼"
        }
    ],

    // Get sample request by index
    getSampleRequest: (index = 0) => {
        const sample = MockData.sampleRequests[index] || MockData.sampleRequests[0];
        return {
            ...sample,
            startDate: sample.startDate(),
            endDate: sample.endDate()
        };
    },

    // Get department user by ID
    getDepartmentUser: (userId) => {
        return MockData.departmentUsers.find(user => user.id === userId);
    },

    // Get users by department
    getUsersByDepartment: (departmentId) => {
        return MockData.departmentUsers.filter(user => user.department === departmentId);
    },
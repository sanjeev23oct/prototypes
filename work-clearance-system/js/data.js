/**
 * Mock Data for Work Clearance System
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
        { id: 'drainage', name: 'Drainage System', color: '#6b7280', critical: false },
        { id: 'internet', name: 'Internet Cables', color: '#8b5cf6', critical: false }
    ],

    // Campus locations
    locations: [
        { id: 'main-hall', name: 'Main Satsang Hall', zone: 'central', coordinates: { x: 50, y: 40 } },
        { id: 'admin-block', name: 'Administrative Block', zone: 'north', coordinates: { x: 30, y: 20 } },
        { id: 'guest-house', name: 'Guest House Complex', zone: 'east', coordinates: { x: 70, y: 30 } },
        { id: 'kitchen-area', name: 'Community Kitchen', zone: 'west', coordinates: { x: 20, y: 50 } },
        { id: 'parking-area', name: 'Main Parking Area', zone: 'south', coordinates: { x: 40, y: 70 } },
        { id: 'garden-area', name: 'Garden & Landscaping', zone: 'east', coordinates: { x: 80, y: 60 } },
        { id: 'security-gate', name: 'Main Security Gate', zone: 'south', coordinates: { x: 45, y: 85 } },
        { id: 'library', name: 'Spiritual Library', zone: 'north', coordinates: { x: 25, y: 25 } },
        { id: 'meditation-hall', name: 'Meditation Hall', zone: 'central', coordinates: { x: 55, y: 35 } },
        { id: 'service-area', name: 'Service Area', zone: 'west', coordinates: { x: 15, y: 45 } }
    ],

    // Approval authorities
    approvers: [
        { id: 'supervisor', name: 'Department Supervisor', role: 'Supervisor', level: 1 },
        { id: 'infrastructure', name: 'Infrastructure Manager', role: 'Manager', level: 2 },
        { id: 'safety', name: 'Safety Officer', role: 'Safety', level: 2 },
        { id: 'electrical', name: 'Chief Electrician', role: 'Technical', level: 2 },
        { id: 'it', name: 'IT Manager', role: 'Technical', level: 2 },
        { id: 'transport', name: 'Transport Manager', role: 'Manager', level: 2 },
        { id: 'admin', name: 'Administrative Head', role: 'Admin', level: 3 },
        { id: 'director', name: 'Campus Director', role: 'Director', level: 4 }
    ],

    // Generate mock work requests
    generateWorkRequests: () => {
        const statuses = ['pending', 'approved', 'active', 'completed', 'rejected', 'on-hold'];
        const priorities = ['low', 'medium', 'high', 'urgent'];
        const requests = [];

        for (let i = 1; i <= 25; i++) {
            const department = MockData.departments[Math.floor(Math.random() * MockData.departments.length)];
            const workType = MockData.workTypes[Math.floor(Math.random() * MockData.workTypes.length)];
            const location = MockData.locations[Math.floor(Math.random() * MockData.locations.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const priority = priorities[Math.floor(Math.random() * priorities.length)];
            
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) - 15);
            
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 7) + 1);

            requests.push({
                id: `WR-${String(i).padStart(4, '0')}`,
                requesterId: `user_${i}`,
                requesterName: MockData.generateRandomName(),
                department: department.id,
                departmentName: department.name,
                workType: workType.id,
                workTypeName: workType.name,
                title: MockData.generateWorkTitle(workType.name, location.name),
                description: MockData.generateWorkDescription(workType.name, location.name),
                location: location.id,
                locationName: location.name,
                status: status,
                priority: priority,
                riskLevel: workType.riskLevel,
                estimatedDuration: Math.floor(Math.random() * 8) + 1, // 1-8 hours
                plannedStartDate: startDate.toISOString(),
                plannedEndDate: endDate.toISOString(),
                actualStartDate: status === 'active' || status === 'completed' ? startDate.toISOString() : null,
                actualEndDate: status === 'completed' ? endDate.toISOString() : null,
                createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date().toISOString(),
                infrastructureAffected: MockData.getRandomInfrastructure(),
                notifyDepartments: MockData.generateNotifyDepartments(),
                approvalChain: MockData.generateApprovalChain(workType.requiresApproval),
                notifications: MockData.generateNotifications(i),
                attachments: Math.random() > 0.7 ? MockData.generateAttachments() : [],
                comments: MockData.generateComments(i),
                emergencyContact: department.contact,
                safetyMeasures: MockData.generateSafetyMeasures(workType.riskLevel)
            });
        }

        return requests;
    },

    // Generate random Indian names
    generateRandomName: () => {
        const firstNames = [
            'Rajesh', 'Priya', 'Amit', 'Sunita', 'Vikram', 'Neha', 'Suresh', 'Kavita',
            'Manoj', 'Pooja', 'Ravi', 'Meera', 'Anil', 'Deepika', 'Sanjay', 'Rekha',
            'Ashok', 'Geeta', 'Ramesh', 'Sita', 'Vinod', 'Usha', 'Prakash', 'Lata'
        ];
        const lastNames = [
            'Kumar', 'Sharma', 'Patel', 'Singh', 'Gupta', 'Yadav', 'Agarwal', 'Verma',
            'Jain', 'Mishra', 'Tiwari', 'Pandey', 'Srivastava', 'Chauhan', 'Joshi', 'Nair'
        ];
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        return `${firstName} ${lastName}`;
    },

    // Generate work titles
    generateWorkTitle: (workType, location) => {
        const templates = {
            'Excavation/Digging': [
                `Excavation work near ${location}`,
                `Underground cable laying at ${location}`,
                `Foundation digging for ${location}`,
                `Drainage work at ${location}`
            ],
            'Electrical Work': [
                `Electrical maintenance at ${location}`,
                `New power connection for ${location}`,
                `Lighting installation at ${location}`,
                `Electrical panel upgrade at ${location}`
            ],
            'Plumbing Work': [
                `Water pipe repair at ${location}`,
                `Plumbing maintenance for ${location}`,
                `New water connection at ${location}`,
                `Drainage cleaning at ${location}`
            ],
            'Construction Work': [
                `Construction project at ${location}`,
                `Building renovation at ${location}`,
                `New structure construction near ${location}`,
                `Expansion work at ${location}`
            ],
            'General Maintenance': [
                `Routine maintenance at ${location}`,
                `Facility upkeep for ${location}`,
                `General repairs at ${location}`,
                `Preventive maintenance at ${location}`
            ],
            'Landscaping Work': [
                `Garden maintenance at ${location}`,
                `Tree planting near ${location}`,
                `Lawn care at ${location}`,
                `Landscape beautification at ${location}`
            ]
        };

        const typeTemplates = templates[workType] || [`${workType} at ${location}`];
        return typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
    },

    // Generate work descriptions
    generateWorkDescription: (workType, location) => {
        const descriptions = {
            'Excavation/Digging': [
                'Excavation required for underground utility installation. Proper safety measures and infrastructure mapping needed.',
                'Digging work for foundation preparation. Risk of damaging existing underground cables.',
                'Trenching work for new drainage system. Coordination with multiple departments required.'
            ],
            'Electrical Work': [
                'Electrical installation and maintenance work. Power shutdown may be required during work hours.',
                'Upgrading electrical systems to meet current safety standards. Temporary power arrangements needed.',
                'Installation of new lighting fixtures and electrical connections.'
            ],
            'Plumbing Work': [
                'Plumbing repair and maintenance work. Water supply may be affected during work.',
                'Installation of new water connections and pipe repairs. Coordination with water department needed.',
                'Drainage system maintenance and cleaning work.'
            ]
        };

        const typeDescriptions = descriptions[workType] || [`${workType} maintenance and repair work at ${location}.`];
        return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
    },

    // Generate random departments to notify
    generateNotifyDepartments: () => {
        const count = Math.floor(Math.random() * 4) + 2; // 2-5 departments
        const shuffled = [...MockData.departments].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count).map(dept => ({
            id: dept.id,
            name: dept.name,
            head: dept.head,
            contact: dept.contact,
            notificationSent: Math.random() > 0.3, // 70% chance notification sent
            clearanceReceived: Math.random() > 0.5, // 50% chance clearance received
            clearanceDate: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString() : null,
            comments: Math.random() > 0.7 ? 'No issues from our department' : ''
        }));
    },
    getRandomInfrastructure: () => {
        const count = Math.floor(Math.random() * 3) + 1; // 1-3 infrastructure types
        const shuffled = [...MockData.infrastructureTypes].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count).map(infra => infra.id);
    },

    // Generate approval chain based on work type requirements
    generateApprovalChain: (requiredApprovals) => {
        return requiredApprovals.map(approvalType => {
            const approver = MockData.approvers.find(a => a.id === approvalType);
            const statuses = ['pending', 'approved', 'rejected'];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            return {
                approverId: approver.id,
                approverName: approver.name,
                approverRole: approver.role,
                level: approver.level,
                status: status,
                approvedAt: status === 'approved' ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString() : null,
                comments: status === 'rejected' ? 'Additional safety measures required' : status === 'approved' ? 'Approved with conditions' : null
            };
        }).sort((a, b) => a.level - b.level);
    },

    // Generate notifications for a request
    generateNotifications: (requestId) => {
        const notifications = [];
        const types = ['info', 'warning', 'success', 'error'];
        const count = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < count; i++) {
            notifications.push({
                id: `notif_${requestId}_${i}`,
                type: types[Math.floor(Math.random() * types.length)],
                title: MockData.generateNotificationTitle(),
                message: MockData.generateNotificationMessage(),
                createdAt: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString(),
                read: Math.random() > 0.3
            });
        }

        return notifications;
    },

    // Generate notification titles
    generateNotificationTitle: () => {
        const titles = [
            'Approval Required',
            'Work Scheduled',
            'Infrastructure Alert',
            'Safety Reminder',
            'Status Update',
            'Completion Notice',
            'Delay Notification',
            'Emergency Alert'
        ];
        return titles[Math.floor(Math.random() * titles.length)];
    },

    // Generate notification messages
    generateNotificationMessage: () => {
        const messages = [
            'Your work request requires additional approvals before proceeding.',
            'Work has been scheduled and will begin as planned.',
            'Potential infrastructure conflict detected in work area.',
            'Please ensure all safety measures are in place before starting work.',
            'Work status has been updated. Please review the changes.',
            'Work has been completed successfully.',
            'Work has been delayed due to weather conditions.',
            'Emergency situation detected. All work must stop immediately.'
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    },

    // Generate file attachments
    generateAttachments: () => {
        const fileTypes = [
            { name: 'Site_Plan.pdf', type: 'application/pdf', size: 2048576 },
            { name: 'Safety_Checklist.docx', type: 'application/docx', size: 1024000 },
            { name: 'Infrastructure_Map.jpg', type: 'image/jpeg', size: 3145728 },
            { name: 'Work_Permit.pdf', type: 'application/pdf', size: 512000 }
        ];

        const count = Math.floor(Math.random() * 3) + 1;
        return fileTypes.slice(0, count).map((file, index) => ({
            id: `file_${index}`,
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
            uploadedBy: MockData.generateRandomName()
        }));
    },

    // Generate comments/notes
    generateComments: (requestId) => {
        const comments = [];
        const commentTexts = [
            'Please ensure proper safety barriers are in place.',
            'Coordination with security team completed.',
            'Infrastructure mapping verified and approved.',
            'Work area has been marked and secured.',
            'Additional equipment may be required.',
            'Weather conditions are favorable for work.',
            'All necessary permits have been obtained.'
        ];

        const count = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < count; i++) {
            comments.push({
                id: `comment_${requestId}_${i}`,
                author: MockData.generateRandomName(),
                text: commentTexts[Math.floor(Math.random() * commentTexts.length)],
                createdAt: new Date(Date.now() - Math.random() * 72 * 60 * 60 * 1000).toISOString()
            });
        }

        return comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

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

    // Get current statistics
    getStatistics: () => {
        const requests = MockData.generateWorkRequests();
        return {
            pending: requests.filter(r => r.status === 'pending').length,
            active: requests.filter(r => r.status === 'active').length,
            completed: requests.filter(r => r.status === 'completed' && Utils.date.isToday(r.actualEndDate)).length,
            risks: requests.filter(r => r.riskLevel === 'high' && r.status !== 'completed').length
        };
    }
};

// Initialize data in localStorage if not exists
if (!Utils.storage.get('workRequests')) {
    Utils.storage.set('workRequests', MockData.generateWorkRequests());
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockData;
}
/**
 * Mock Data for DAK Handling System
 * Realistic data for RSSB Letter Management
 */

const DAKData = {
    // Organizational hierarchy
    zones: [
        { id: 'zone1', name: 'Zone 1 - North India', code: 'Z1' },
        { id: 'zone2', name: 'Zone 2 - South India', code: 'Z2' },
        { id: 'zone3', name: 'Zone 3 - East India', code: 'Z3' }
    ],

    coordinators: [
        { id: 'co1', name: 'Punjab Coordinator', zoneId: 'zone1', code: 'CO-PB' },
        { id: 'co2', name: 'Haryana Coordinator', zoneId: 'zone1', code: 'CO-HR' },
        { id: 'co3', name: 'Karnataka Coordinator', zoneId: 'zone2', code: 'CO-KA' },
        { id: 'co4', name: 'Tamil Nadu Coordinator', zoneId: 'zone2', code: 'CO-TN' }
    ],

    areas: [
        { id: 'area1', name: 'Amritsar Area', coordinatorId: 'co1', code: 'AMR' },
        { id: 'area2', name: 'Ludhiana Area', coordinatorId: 'co1', code: 'LDH' },
        { id: 'area3', name: 'Chandigarh Area', coordinatorId: 'co2', code: 'CHD' },
        { id: 'area4', name: 'Bangalore Area', coordinatorId: 'co3', code: 'BLR' },
        { id: 'area5', name: 'Chennai Area', coordinatorId: 'co4', code: 'CHN' }
    ],

    satsangPlaces: [
        { id: 'sp1', name: 'Amritsar Centre', areaId: 'area1', type: 'Centre' },
        { id: 'sp2', name: 'Model Town SubCentre', areaId: 'area1', type: 'SubCentre' },
        { id: 'sp3', name: 'Ranjit Avenue Point', areaId: 'area1', type: 'Point' },
        { id: 'sp4', name: 'Ludhiana Centre', areaId: 'area2', type: 'Centre' },
        { id: 'sp5', name: 'Civil Lines SubCentre', areaId: 'area2', type: 'SubCentre' },
        { id: 'sp6', name: 'Chandigarh Centre', areaId: 'area3', type: 'Centre' },
        { id: 'sp7', name: 'Bangalore Centre', areaId: 'area4', type: 'Centre' },
        { id: 'sp8', name: 'Chennai Centre', areaId: 'area5', type: 'Centre' }
    ],

    // Letter subjects
    subjects: [
        { id: 'sub1', name: 'SCI-15 Donation Request', category: 'donation', requiresCO: true, requiresZO: false, isSCM: false },
        { id: 'sub2', name: 'Building Construction Approval', category: 'construction', requiresCO: true, requiresZO: true, isSCM: true },
        { id: 'sub3', name: 'Satsang Schedule Change', category: 'general', requiresCO: true, requiresZO: false, isSCM: false },
        { id: 'sub4', name: 'Volunteer Appointment', category: 'general', requiresCO: true, requiresZO: false, isSCM: false },
        { id: 'sub5', name: 'Land Purchase Proposal', category: 'property', requiresCO: true, requiresZO: true, isSCM: true },
        { id: 'sub6', name: 'Centre Renovation', category: 'construction', requiresCO: true, requiresZO: true, isSCM: true },
        { id: 'sub7', name: 'Book Distribution', category: 'general', requiresCO: true, requiresZO: false, isSCM: false },
        { id: 'sub8', name: 'Event Permission', category: 'general', requiresCO: true, requiresZO: false, isSCM: false }
    ],

    // Document types
    documentTypes: [
        { id: 'doc1', name: 'Application Letter' },
        { id: 'doc2', name: 'Request Letter' },
        { id: 'doc3', name: 'Information Letter' },
        { id: 'doc4', name: 'Proposal Document' },
        { id: 'doc5', name: 'Report' }
    ],

    // User roles and permissions
    users: [
        {
            id: 'ao_user',
            name: 'Rajesh Kumar',
            role: 'AO',
            office: 'Area Office',
            areaId: 'area1',
            permissions: ['create_letter', 'view_own_letters', 'respond_to_objections'],
            avatar: '📝'
        },
        {
            id: 'co_user',
            name: 'Amit Singh',
            role: 'CO',
            office: 'Coordinator Office',
            coordinatorId: 'co1',
            permissions: ['view_area_letters', 'make_recommendations', 'make_decisions', 'raise_objections'],
            avatar: '👨‍💼'
        },
        {
            id: 'zo_user',
            name: 'Priya Sharma',
            role: 'ZO',
            office: 'Zonal Office',
            zoneId: 'zone1',
            permissions: ['view_zone_letters', 'make_decisions', 'send_to_sci', 'manage_auto_marking'],
            avatar: '👔'
        },
        {
            id: 'sci_user',
            name: 'Dr. Rajesh Gupta',
            role: 'SCI',
            office: 'SCI-Beas',
            permissions: ['view_all_letters', 'upload_decisions', 'final_approval'],
            avatar: '🏛️'
        },
        {
            id: 'so_user',
            name: 'Neha Verma',
            role: 'SO',
            office: 'Centre Secretary',
            satsangPlaceId: 'sp1',
            permissions: ['view_centre_letters'],
            avatar: '📋'
        }
    ],

    // Letter statuses
    statuses: [
        { id: 'NEW', name: 'New', color: 'blue' },
        { id: 'MARKED', name: 'Marked', color: 'yellow' },
        { id: 'RECOMMENDATION_UPLOADED', name: 'Recommendation Uploaded', color: 'orange' },
        { id: 'SENT_TO_SCI', name: 'Sent to SCI-Beas', color: 'purple' },
        { id: 'DECISION_RECEIVED', name: 'Decision Received', color: 'green' },
        { id: 'COMPLETED', name: 'Completed', color: 'gray' },
        { id: 'OBJECTION_RAISED', name: 'Objection Raised', color: 'red' },
        { id: 'CLARIFICATION_PENDING', name: 'Clarification Pending', color: 'red' }
    ],

    // Generate mock letters
    generateLetters: () => {
        const letters = [];
        const statuses = ['NEW', 'MARKED', 'SENT_TO_SCI', 'DECISION_RECEIVED', 'COMPLETED'];
        
        for (let i = 1; i <= 30; i++) {
            const area = DAKData.areas[Math.floor(Math.random() * DAKData.areas.length)];
            const satsangPlace = DAKData.satsangPlaces.find(sp => sp.areaId === area.id) || DAKData.satsangPlaces[0];
            const subject = DAKData.subjects[Math.floor(Math.random() * DAKData.subjects.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const docType = DAKData.documentTypes[Math.floor(Math.random() * DAKData.documentTypes.length)];
            
            const letterDate = new Date();
            letterDate.setDate(letterDate.getDate() - Math.floor(Math.random() * 60));
            
            const isDonation = subject.category === 'donation';
            const donationAmount = isDonation ? Math.floor(Math.random() * 50000) + 5000 : null;
            
            letters.push({
                id: `LTR-${area.code}-${String(i).padStart(4, '0')}`,
                areaId: area.id,
                areaName: area.name,
                satsangPlaceId: satsangPlace.id,
                satsangPlaceName: satsangPlace.name,
                satsangPlaceType: satsangPlace.type,
                letterDate: letterDate.toISOString().split('T')[0],
                referenceNumber: `REF/${area.code}/${i}/2025`,
                subjectId: subject.id,
                subjectName: subject.name,
                subjectCategory: subject.category,
                isSCM: subject.isSCM,
                documentTypeId: docType.id,
                documentTypeName: docType.name,
                status: status,
                isDonation: isDonation,
                donationAmount: donationAmount,
                scanUploaded: Math.random() > 0.2,
                scanUploadDate: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
                markedTo: DAKData.getMarkedTo(subject, area),
                markedBy: 'System Auto-Marking',
                markedDate: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: letterDate.toISOString(),
                createdBy: 'ao_user',
                trail: DAKData.generateLetterTrail(status),
                messages: Math.random() > 0.7 ? DAKData.generateMessages() : [],
                emailTrail: DAKData.generateEmailTrail(status)
            });
        }
        
        return letters;
    },

    // Get marked to based on subject and area
    getMarkedTo: (subject, area) => {
        if (subject.requiresZO) {
            const coordinator = DAKData.coordinators.find(c => c.id === area.coordinatorId);
            const zone = DAKData.zones.find(z => z.id === coordinator.zoneId);
            return {
                office: 'ZO',
                officeName: zone.name,
                person: 'Zonal Officer'
            };
        } else if (subject.requiresCO) {
            const coordinator = DAKData.coordinators.find(c => c.id === area.coordinatorId);
            return {
                office: 'CO',
                officeName: coordinator.name,
                person: 'Coordinator'
            };
        }
        return {
            office: 'AO',
            officeName: area.name,
            person: 'Area Secretary'
        };
    },

    // Generate letter trail
    generateLetterTrail: (status) => {
        const trail = [];
        
        trail.push({
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            action: 'Letter Created',
            by: 'Rajesh Kumar (AO)',
            office: 'Area Office',
            details: 'Letter entry created with scan upload'
        });
        
        trail.push({
            date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            action: 'Auto-Marked',
            by: 'System',
            office: 'System',
            details: 'Automatically marked to Coordinator Office'
        });
        
        if (status !== 'NEW') {
            trail.push({
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                action: 'Recommendation Uploaded',
                by: 'Amit Singh (CO)',
                office: 'Coordinator Office',
                details: 'Recommendation document uploaded'
            });
        }
        
        if (status === 'SENT_TO_SCI' || status === 'DECISION_RECEIVED' || status === 'COMPLETED') {
            trail.push({
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                action: 'Sent to SCI-Beas',
                by: 'Priya Sharma (ZO)',
                office: 'Zonal Office',
                details: 'Letter forwarded to SCI-Beas with recommendations'
            });
        }
        
        if (status === 'DECISION_RECEIVED' || status === 'COMPLETED') {
            trail.push({
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                action: 'Decision Received',
                by: 'Dr. Rajesh Gupta (SCI)',
                office: 'SCI-Beas',
                details: 'Decision uploaded and email sent to Area Secretary'
            });
        }
        
        return trail;
    },

    // Generate messages
    generateMessages: () => {
        return [
            {
                id: 'msg1',
                from: 'Amit Singh (CO)',
                to: 'Rajesh Kumar (AO)',
                type: 'objection',
                subject: 'Clarification Required',
                message: 'Please provide additional details about the donation purpose and beneficiary information.',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                read: true
            },
            {
                id: 'msg2',
                from: 'Rajesh Kumar (AO)',
                to: 'Amit Singh (CO)',
                type: 'clarification',
                subject: 'Re: Clarification Required',
                message: 'The donation is for centre building maintenance. Beneficiary details attached in updated scan.',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                read: true
            }
        ];
    },

    // Generate email trail
    generateEmailTrail: (status) => {
        const trail = [];
        
        if (status === 'DECISION_RECEIVED' || status === 'COMPLETED') {
            trail.push({
                id: 'email1',
                to: 'area.secretary@example.com',
                subject: 'Decision Received for Letter LTR-AMR-0001',
                sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'sent',
                body: 'Decision has been received from SCI-Beas for your letter. Please check the system for details.'
            });
        }
        
        return trail;
    },

    // Sample letter data for quick form population
    sampleLetters: [
        {
            areaId: 'area1',
            satsangPlaceId: 'sp1',
            letterDate: new Date().toISOString().split('T')[0],
            referenceNumber: 'REF/AMR/001/2025',
            subjectId: 'sub1',
            documentTypeId: 'doc1',
            isDonation: true,
            donationAmount: 25000,
            description: 'Request for SCI-15 donation approval for centre building maintenance work. The work includes roof repair and painting.'
        },
        {
            areaId: 'area2',
            satsangPlaceId: 'sp4',
            letterDate: new Date().toISOString().split('T')[0],
            referenceNumber: 'REF/LDH/002/2025',
            subjectId: 'sub2',
            documentTypeId: 'doc4',
            isDonation: false,
            donationAmount: null,
            description: 'Proposal for new satsang hall construction at Ludhiana Centre. Detailed plans and cost estimates attached.'
        }
    ],

    // Get sample letter
    getSampleLetter: (index = 0) => {
        return DAKData.sampleLetters[index] || DAKData.sampleLetters[0];
    },

    // Get user by ID
    getUser: (userId) => {
        return DAKData.users.find(u => u.id === userId);
    },

    // Get area by ID
    getArea: (areaId) => {
        return DAKData.areas.find(a => a.id === areaId);
    },

    // Get coordinator by ID
    getCoordinator: (coordinatorId) => {
        return DAKData.coordinators.find(c => c.id === coordinatorId);
    },

    // Get zone by ID
    getZone: (zoneId) => {
        return DAKData.zones.find(z => z.id === zoneId);
    },

    // Get subject by ID
    getSubject: (subjectId) => {
        return DAKData.subjects.find(s => s.id === subjectId);
    },

    // Get statistics
    getStatistics: (letters, currentUser) => {
        return {
            pending: letters.filter(l => l.status === 'NEW' || l.status === 'MARKED').length,
            markedToMe: letters.filter(l => DAKData.isMarkedToUser(l, currentUser)).length,
            sentToSCI: letters.filter(l => l.status === 'SENT_TO_SCI').length,
            completed: letters.filter(l => l.status === 'COMPLETED').length
        };
    },

    // Check if letter is marked to current user
    isMarkedToUser: (letter, user) => {
        if (!user || !letter.markedTo) return false;
        
        if (user.role === 'CO' && letter.markedTo.office === 'CO') {
            const area = DAKData.getArea(letter.areaId);
            return area && area.coordinatorId === user.coordinatorId;
        }
        
        if (user.role === 'ZO' && letter.markedTo.office === 'ZO') {
            const area = DAKData.getArea(letter.areaId);
            const coordinator = DAKData.getCoordinator(area.coordinatorId);
            return coordinator && coordinator.zoneId === user.zoneId;
        }
        
        return false;
    }
};

// Initialize data in localStorage if not exists
if (typeof window !== 'undefined' && typeof Utils !== 'undefined') {
    try {
        if (!Utils.storage.get('dakLetters')) {
            Utils.storage.set('dakLetters', DAKData.generateLetters());
        }
        console.log('✓ DAKData initialized successfully');
    } catch (error) {
        console.error('Error initializing DAKData:', error);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DAKData;
}

console.log('✓ dak-data.js loaded successfully');

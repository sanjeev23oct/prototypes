# DAK Handling System (DHS) - Prototype

A comprehensive letter management application designed to handle the complete lifecycle of physical correspondence within a hierarchical organizational structure for RSSB.

## Overview

The DAK Handling System manages letters flowing between:
- **Area Offices (AO)** - Lowest level office that initiates letter entries
- **Coordinator Offices (CO)** - Manages multiple areas within a state
- **Zonal Offices (ZO)** - Manages multiple coordinator offices within a zone
- **SCI-Beas** - Supreme Central Institution at Beas (highest authority)
- **Centre Secretary Offices (SO)** - View-only access for centre-related letters

## Key Features Implemented

### 1. Letter Entry (Requirement 1)
- Area Office users can create new letter entries
- Complete letter details capture (area, satsang place, date, reference, subject, document type)
- Mandatory scan upload with validation
- Automatic marking to appropriate office based on subject
- Duplicate prevention

### 2. Letter Review & Processing (Requirements 2 & 3)
- CO/ZO users can view letters marked to them
- Letter trail tracking with complete history
- Status management and progression
- Auto-marking based on subject and area configuration

### 3. Letter Search & History (Requirement 4)
- Search and filter by area, status
- Complete letter trail with timestamps
- View all status changes and actions
- Access to uploaded scans

### 4. Auto-Marking (Requirement 5)
- Automatic letter routing based on subject and area
- Donation amount-based routing
- Configurable marking rules
- Smart assignment to appropriate authority

### 5. Donation Management (Requirement 8)
- Capture donation amounts
- Amount-based routing (CO vs ZO)
- Donation tracking and reporting
- Amount limit validation

### 6. Reporting & Tracking (Requirement 9)
- Dashboard with key statistics
- Status-wise letter grouping
- Area-wise monitoring
- Letter flow tracking

### 7. User Roles & Permissions (Requirement 7)
- Role-based access control
- Office-specific letter visibility
- Hierarchical data filtering
- User impersonation for demo

### 8. Email Notifications (Requirement 11)
- Email trail tracking
- Automated notification logging
- Delivery status tracking

### 9. Centre Secretary View (Requirement 12)
- Read-only access to centre letters
- Geographical jurisdiction filtering
- Letter visibility without modification rights

## Technology Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Inter)
- **Storage**: LocalStorage for demo data persistence

## File Structure

```
dak-handling-system/
├── index.html              # Main application page
├── css/
│   └── dak-system.css     # DAK-specific styles
├── js/
│   ├── dak-data.js        # Mock data and data models
│   ├── dak-components.js  # Reusable UI components
│   ├── dak-system.js      # Core business logic
│   └── dak-app.js         # Application initialization
└── README.md              # This file
```

## Getting Started

1. Open `index.html` in a modern web browser
2. The system will initialize with sample data
3. Use the impersonation panel to switch between different user roles
4. Test different workflows by creating and viewing letters

## User Roles for Testing

### Area Office (AO)
- **User**: Rajesh Kumar
- **Permissions**: Create letters, view own letters, respond to objections
- **Test**: Create new letter entries with scan uploads

### Coordinator Office (CO)
- **User**: Amit Singh
- **Permissions**: View area letters, make recommendations, make decisions
- **Test**: Review and process letters from assigned areas

### Zonal Office (ZO)
- **User**: Priya Sharma
- **Permissions**: View zone letters, make decisions, send to SCI-Beas
- **Test**: Process letters requiring zonal authority

### SCI-Beas
- **User**: Dr. Rajesh Gupta
- **Permissions**: View all letters, upload decisions, final approval
- **Test**: View all letters and upload decisions

### Centre Secretary (SO)
- **User**: Neha Verma
- **Permissions**: View centre letters (read-only)
- **Test**: Monitor letters related to assigned centre

## Key Workflows

### Creating a New Letter (AO)
1. Click "New Letter" button
2. Fill in letter details (area, satsang place, date, reference, subject)
3. Upload letter scan (mandatory)
4. For donation letters, enter amount
5. Submit - letter is auto-marked to appropriate office

### Processing Letters (CO/ZO)
1. View letters marked to your office
2. Review letter details and trail
3. Upload recommendations or decisions
4. Forward to next level or send to SCI-Beas

### Viewing Letter History
1. Click on any letter in the table
2. View complete trail with timestamps
3. See all status changes and actions
4. Access messages and email trail

## Features Demonstrated

✅ Letter entry with scan upload  
✅ Auto-marking based on subject  
✅ Role-based access control  
✅ Letter trail tracking  
✅ Donation amount handling  
✅ Status management  
✅ Dashboard statistics  
✅ User impersonation (demo mode)  
✅ Message threading  
✅ Email trail logging  
✅ Responsive design  
✅ Form validation  
✅ File upload handling  

## Future Enhancements

The following features from requirements are planned for future implementation:

- Area blocking for overdue scans (Requirement 6)
- Complete recommendation/decision upload workflow (Requirements 2 & 3)
- Internal messaging system (Requirement 10)
- Runsheet generation (Requirement 9)
- Monthly donation reports (Requirement 9)
- Advanced search and filtering
- Bulk operations
- Export functionality
- Print-friendly views

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Notes

- This is a prototype for demonstration purposes
- Data is stored in browser LocalStorage
- Sample data is generated on first load
- Use "Load Sample" button for quick form testing
- Impersonation panel allows testing different user roles

## Support

For questions or issues, please refer to the requirements document or contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: Prototype - Demo Ready

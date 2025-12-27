
## Purpose

This constitution defines standards for creating functional, beautiful HTML5 + JavaScript prototypes that Business Analysts and UX professionals can build while sitting with business stakeholders. These prototypes serve as the bridge between business requirements and development teams.

## Target Audience

- **Business Analysts**: Gathering requirements and creating functional prototypes
- **UX Designers**: Creating interactive mockups with real behavior
- **Product Owners**: Demonstrating concepts to stakeholders
- **Business Stakeholders**: Providing feedback on working prototypes

## Technology Stack

### Core Technologies
- **HTML5**: Semantic, accessible markup
- **CSS3**: Modern styling with Flexbox/Grid
- **Vanilla JavaScript**: ES6+ for interactivity (no framework dependencies)
- **Local Storage**: For simulating data persistence

# Prototype Development Standards for Business Analysts & UX
### Recommended Libraries (CDN-based, no build tools)
- **Tailwind CSS**: For rapid, modern styling
- **Chart.js**: For data visualizations and dashboards
- **Alpine.js**: Lightweight reactivity (optional, for complex interactions)
- **Font Awesome**: Icon library
- **Google Fonts**: Typography

### No Build Tools Required
- All libraries loaded via CDN
- Single HTML file or simple folder structure
- Can be opened directly in browser
- Easy to share via email, Dropbox, or simple web hosting

## Prototype Characteristics

### What Makes a Good BA/UX Prototype

**Functional, Not Production-Ready**
- Demonstrates user flows and interactions
- Shows business logic visually
- Uses mock data (realistic but fake)
- Focuses on UX and business rules, not backend integration

**Beautiful and Modern**
- Professional appearance that impresses stakeholders
- Consistent design system
- Smooth animations and transitions
- Responsive design (works on desktop, tablet, mobile)

**Self-Documenting**
- Clear comments explaining business logic
- Inline documentation of user flows
- README explaining how to use the prototype
- Notes on business rules and validations

**Easy to Modify**
- Simple, readable code
- No complex build processes
- BAs can update without developer help
- Quick iterations during stakeholder meetings

## File Structure

### Simple Prototype (Single Page)
```
prototype.html          # All-in-one file
```

### Multi-Page Prototype
```
prototype/
├── index.html          # Landing/dashboard page
├── customers.html      # Customer list page
├── customer-detail.html # Customer detail page
├── css/
│   └── styles.css      # Custom styles
├── js/
│   ├── app.js          # Main application logic
│   ├── data.js         # Mock data
│   └── utils.js        # Helper functions
├── assets/
│   └── images/         # Images and icons
└── README.md           # How to use the prototype
```

## HTML Structure Standards

### Template Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRM Dashboard - Prototype</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Chart.js for visualizations -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Prototype content here -->
    
    <script>
        // JavaScript logic here
    </script>
</body>
</html>
```

### Semantic HTML
- Use semantic tags: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- Proper heading hierarchy (h1 → h2 → h3)
- Accessible forms with labels
- ARIA attributes for screen readers

## Design System Standards

### Color Palette (Tailwind-based)
```javascript
// Primary Colors
primary: {
  50: '#eff6ff',   // Very light blue
  500: '#3b82f6',  // Primary blue
  600: '#2563eb',  // Darker blue
  700: '#1d4ed8'   // Dark blue
}

// Semantic Colors
success: '#10b981'  // Green
warning: '#f59e0b'  // Orange
error: '#ef4444'    // Red
info: '#3b82f6'     // Blue

// Neutrals
gray: {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  500: '#6b7280',
  700: '#374151',
  900: '#111827'
}
```

### Typography
```css
/* Headings */
h1: text-3xl font-bold text-gray-900
h2: text-2xl font-semibold text-gray-800
h3: text-xl font-medium text-gray-700

/* Body */
body: text-base text-gray-600
small: text-sm text-gray-500

/* Font Weights */
Light: 300
Regular: 400
Medium: 500
Semibold: 600
Bold: 700
```

### Spacing
- Use Tailwind's spacing scale (4px increments)
- Consistent padding: p-4, p-6, p-8
- Consistent margins: mb-4, mb-6, mb-8
- Card spacing: p-6 for content, mb-6 between cards

### Components

**Cards**
```html
<div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h3 class="text-xl font-semibold mb-4">Card Title</h3>
    <p class="text-gray-600">Card content</p>
</div>
```

**Buttons**
```html
<!-- Primary Button -->
<button class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition">
    Primary Action
</button>

<!-- Secondary Button -->
<button class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2 rounded-lg transition">
    Secondary Action
</button>

<!-- Danger Button -->
<button class="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition">
    Delete
</button>
```

**Form Inputs**
```html
<div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-2">
        Email Address
    </label>
    <input type="email" 
           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           placeholder="you@example.com">
</div>
```

## JavaScript Standards

### Code Organization
```javascript
// 1. Mock Data
const mockData = {
    customers: [...],
    orders: [...],
    products: [...]
};

// 2. State Management (simple object)
const appState = {
    currentUser: null,
    selectedCustomer: null,
    filters: {}
};

// 3. Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// 4. Business Logic Functions
function calculateTotalRevenue(orders) {
    return orders.reduce((sum, order) => sum + order.total, 0);
}

// 5. UI Rendering Functions
function renderCustomerList(customers) {
    // Render logic
}

// 6. Event Handlers
function handleCustomerClick(customerId) {
    // Handle click
}

// 7. Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});
```

### ES6+ Features to Use
- Arrow functions: `const add = (a, b) => a + b`
- Template literals: `` `Hello ${name}` ``
- Destructuring: `const { id, name } = customer`
- Spread operator: `const newArray = [...oldArray, newItem]`
- Array methods: `map()`, `filter()`, `reduce()`, `find()`
- Async/await: For simulating API calls

### Mock Data Patterns
```javascript
// Realistic mock data
const mockCustomers = [
    {
        id: 1,
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '(555) 123-4567',
        status: 'active',
        totalRevenue: 125000,
        lastContact: '2024-11-10',
        avatar: 'https://ui-avatars.com/api/?name=Acme+Corporation'
    },
    // More customers...
];

// Simulate API delay
function fetchCustomers() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockCustomers);
        }, 500); // Simulate network delay
    });
}
```

### Local Storage for Persistence
```javascript
// Save data
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Load data
function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Use it
function addCustomer(customer) {
    const customers = loadFromLocalStorage('customers') || [];
    customers.push(customer);
    saveToLocalStorage('customers', customers);
    renderCustomerList(customers);
}
```

## Dashboard Components

### Key Metrics Cards
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <!-- Metric Card -->
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-600">Total Revenue</span>
            <i class="fas fa-dollar-sign text-blue-500"></i>
        </div>
        <div class="text-3xl font-bold text-gray-900">$125,430</div>
        <div class="text-sm text-green-600 mt-2">
            <i class="fas fa-arrow-up"></i> 12.5% from last month
        </div>
    </div>
    <!-- More metric cards... -->
</div>
```

### Charts and Visualizations
```javascript
// Revenue Chart Example
const ctx = document.getElementById('revenueChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Revenue',
            data: [12000, 19000, 15000, 25000, 22000, 30000],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        }
    }
});
```

### Data Tables
```html
<div class="bg-white rounded-lg shadow-md overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                </th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200" id="customerTableBody">
            <!-- Rows populated by JavaScript -->
        </tbody>
    </table>
</div>
```

## Interactive Features

### Search and Filter
```javascript
function filterCustomers(searchTerm) {
    const filtered = mockCustomers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderCustomerList(filtered);
}

// Attach to search input
document.getElementById('searchInput').addEventListener('input', (e) => {
    filterCustomers(e.target.value);
});
```

### Sorting
```javascript
function sortCustomers(field, direction = 'asc') {
    const sorted = [...mockCustomers].sort((a, b) => {
        if (direction === 'asc') {
            return a[field] > b[field] ? 1 : -1;
        } else {
            return a[field] < b[field] ? 1 : -1;
        }
    });
    renderCustomerList(sorted);
}
```

### Modal Dialogs
```html
<!-- Modal Overlay -->
<div id="modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
            <h3 class="text-xl font-semibold mb-4">Add New Customer</h3>
            <!-- Form content -->
            <div class="flex justify-end gap-3 mt-6">
                <button onclick="closeModal()" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    Cancel
                </button>
                <button onclick="saveCustomer()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Save
                </button>
            </div>
        </div>
    </div>
</div>

<script>
function openModal() {
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}
</script>
```

### Toast Notifications
```javascript
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
```

## Business Logic Documentation

### Inline Comments for Business Rules
```javascript
/**
 * BUSINESS RULE: Customer Tier Calculation
 * - Bronze: < $10,000 annual revenue
 * - Silver: $10,000 - $50,000 annual revenue
 * - Gold: $50,000 - $100,000 annual revenue
 * - Platinum: > $100,000 annual revenue
 * 
 * Discussed with: John Smith (Sales Director)
 * Date: 2024-11-15
 */
function calculateCustomerTier(annualRevenue) {
    if (annualRevenue < 10000) return 'bronze';
    if (annualRevenue < 50000) return 'silver';
    if (annualRevenue < 100000) return 'gold';
    return 'platinum';
}
```

### README Template
```markdown
# CRM Dashboard Prototype

## Purpose
This prototype demonstrates the proposed CRM dashboard for sales team.

## How to Use
1. Open `index.html` in a web browser
2. No installation or build process required
3. All data is mock data stored in `js/data.js`

## Key Features
- Customer list with search and filter
- Revenue dashboard with charts
- Customer detail view
- Add/edit customer functionality

## Business Rules Implemented
1. Customer tier calculation based on annual revenue
2. Status indicators (active, inactive, at-risk)
3. Revenue trend calculations

## Mock Data
- 50 sample customers
- 200 sample orders
- Data persists in browser localStorage

## Stakeholder Feedback
- [Date] - [Stakeholder Name]: [Feedback]

## Next Steps for Development Team
1. Integrate with actual CRM API
2. Implement authentication
3. Add real-time data updates
4. Implement advanced filtering
```

## Responsive Design

### Mobile-First Approach
```html
<!-- Stack on mobile, grid on desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Cards -->
</div>

<!-- Hide on mobile, show on desktop -->
<div class="hidden md:block">
    <!-- Desktop-only content -->
</div>

<!-- Show on mobile, hide on desktop -->
<div class="block md:hidden">
    <!-- Mobile-only content -->
</div>
```

## Animation and Transitions

### Smooth Interactions
```css
/* Add to custom styles */
.transition-all {
    transition: all 0.3s ease;
}

.hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.fade-in {
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
```

## Handoff to Development Team

### What to Include
1. **Prototype Files**: All HTML, CSS, JS files
2. **README**: How to use, business rules, stakeholder feedback
3. **Screenshots**: Key screens and interactions
4. **Business Requirements**: Detailed document with:
   - User stories
   - Business rules
   - Validation rules
   - Data models
   - API requirements
5. **Design Assets**: Colors, fonts, spacing specifications

### Prototype Limitations to Document
- "This uses mock data - needs real API integration"
- "Authentication is simulated - needs real auth"
- "No error handling for network failures"
- "Performance not optimized for large datasets"

## Best Practices

### Do's
✅ Use realistic mock data
✅ Make it visually impressive
✅ Document business logic clearly
✅ Keep code simple and readable
✅ Test on multiple devices
✅ Get stakeholder feedback early
✅ Iterate quickly

### Don'ts
❌ Don't over-engineer
❌ Don't use complex build tools
❌ Don't worry about production optimization
❌ Don't implement real backend
❌ Don't spend time on edge cases
❌ Don't make it too complex to modify

## Example Prompt for AI

```
Create a beautiful, functional CRM dashboard prototype using HTML5, Tailwind CSS, and vanilla JavaScript.

Requirements:
- Modern, professional design
- Key metrics cards (Total Revenue, Active Customers, Deals Closed, Avg Deal Size)
- Revenue trend chart (last 6 months)
- Customer list table with search and filter
- Customer detail modal
- Add new customer functionality
- Mock data for 20 customers
- Responsive design
- All in a single HTML file
- Use CDN for all libraries

Business Rules:
- Customer tiers: Bronze (<$10k), Silver ($10k-$50k), Gold ($50k-$100k), Platinum (>$100k)
- Status indicators: Active (green), At Risk (yellow), Inactive (red)
- Revenue calculations include all closed deals

Make it look professional and modern, suitable for presenting to executives.
```

## Success Criteria

A successful prototype:
1. **Impresses stakeholders** - Looks professional and polished
2. **Demonstrates functionality** - Shows how the system will work
3. **Captures business logic** - Documents rules and validations
4. **Easy to modify** - BA can update during meetings
5. **Clear handoff** - Dev team understands requirements
6. **Quick to build** - Created in hours, not days

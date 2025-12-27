// Network Topology View JavaScript - Multi-Rack Infrastructure
// Built on v4 foundation with topology-specific enhancements

// Global state
let selectedRack = null;
let connectionsVisible = true;
let rackLabelsVisible = true;
let rackPositions = {}; // Store rack positions
let connectionEndpoints = {}; // Store custom connection endpoints

// Load saved rack positions from localStorage
function loadRackPositions() {
    const saved = localStorage.getItem('topologyRackPositions');
    if (saved) {
        try {
            rackPositions = JSON.parse(saved);
            console.log('Loaded saved rack positions:', rackPositions);
            return true;
        } catch (e) {
            console.error('Error loading rack positions:', e);
        }
    }
    return false;
}

// Load saved connection endpoints from localStorage
function loadConnectionEndpoints() {
    const saved = localStorage.getItem('topologyConnectionEndpoints');
    if (saved) {
        try {
            connectionEndpoints = JSON.parse(saved);
            console.log('Loaded saved connection endpoints:', connectionEndpoints);
            return true;
        } catch (e) {
            console.error('Error loading connection endpoints:', e);
        }
    }
    return false;
}

// Save rack positions to localStorage
function saveRackPositions() {
    localStorage.setItem('topologyRackPositions', JSON.stringify(rackPositions));
    console.log('Saved rack positions:', rackPositions);
}

// Save connection endpoints to localStorage
function saveConnectionEndpoints() {
    localStorage.setItem('topologyConnectionEndpoints', JSON.stringify(connectionEndpoints));
    console.log('Saved connection endpoints:', connectionEndpoints);
}

// Apply saved positions to racks
function applySavedPositions() {
    Object.keys(rackPositions).forEach(rackId => {
        const rack = document.getElementById(`rack-${rackId}`);
        if (rack && rackPositions[rackId]) {
            const pos = rackPositions[rackId];
            rack.style.left = pos.left;
            rack.style.top = pos.top;
            rack.style.right = 'auto';
            rack.style.bottom = 'auto';
            rack.style.transform = 'none';
            console.log(`Applied position to ${rackId}:`, pos);
        }
    });
}

// Rack configurations based on rack2c.txt data
const rackConfigurations = {
    'SR': {
        id: 'SR',
        name: 'Server Room',
        location: 'Main Data Center',
        description: 'Primary server room with core infrastructure and fiber distribution hub',
        devices: {
            42: {
                deviceId: 'LIU-SR-002',
                deviceType: 'liu',
                portCount: 24,
                name: 'Server Room LIU 2',
                details: '24-Port Fiber LIU - Distribution Hub for Gate 2C & 2B',
                ports: {
                    'LIU-SR-002-port-13': { number: 13, status: 'uplink', connectedTo: 'Gate 2C LIU Port 1', notes: 'To Gate 2C Switch Port 1' },
                    'LIU-SR-002-port-14': { number: 14, status: 'uplink', connectedTo: 'Gate 2C LIU Port 2', notes: 'To Gate 2C Switch Port 2' },
                    'LIU-SR-002-port-15': { number: 15, status: 'uplink', connectedTo: 'Gate 2C LIU Port 3', notes: 'To Gate 2C Switch Port 4' },
                    'LIU-SR-002-port-16': { number: 16, status: 'uplink', connectedTo: 'Gate 2C LIU Port 4', notes: 'To Gate 2C Switch Port 6' },
                    'LIU-SR-002-port-17': { number: 17, status: 'uplink', connectedTo: 'Gate 2B Direct', notes: 'Direct to Gate 2B' },
                    'LIU-SR-002-port-18': { number: 18, status: 'uplink', connectedTo: 'Gate 2B Direct', notes: 'Direct to Gate 2B' },
                    'LIU-SR-002-port-19': { number: 19, status: 'uplink', connectedTo: 'Gate 2B Direct', notes: 'Direct to Gate 2B' },
                    'LIU-SR-002-port-20': { number: 20, status: 'uplink', connectedTo: 'Gate 2B Direct', notes: 'Direct to Gate 2B' }
                }
            },
            40: {
                deviceId: 'SW-SR-001',
                deviceType: 'switch',
                portCount: 48,
                name: 'Core Distribution Switch',
                details: 'Cisco Catalyst 9300 - 48-Port Managed Switch'
            },
            38: {
                deviceId: 'SRV-SR-001',
                deviceType: 'server',
                portCount: 4,
                name: 'Application Server',
                details: 'Dell PowerEdge R740 - Primary Application Server'
            },
            36: {
                deviceId: 'SRV-SR-002',
                deviceType: 'server',
                portCount: 4,
                name: 'Database Server',
                details: 'Dell PowerEdge R740 - MySQL Database Server'
            },
            34: {
                deviceId: 'SRV-SR-003',
                deviceType: 'server',
                portCount: 4,
                name: 'File & Backup Server',
                details: 'Dell PowerEdge R640 - NAS & Backup Storage'
            },
            3: {
                deviceId: 'UPS-SR-001',
                deviceType: 'ups',
                portCount: 0,
                name: 'Primary UPS System',
                details: 'APC Smart-UPS 3000VA - Rack Mount UPS'
            },
            2: {
                deviceId: 'UPS-SR-002',
                deviceType: 'ups',
                portCount: 0,
                name: 'Secondary UPS System',
                details: 'APC Smart-UPS 3000VA - Backup Power'
            }
        },
        stats: {
            utilization: 85,
            totalConnections: 12,
            activeDevices: 7,
            powerConsumption: '2.8kW'
        }
    },
    
    'G2C': {
        id: 'G2C',
        name: 'Gate 2C Network Rack',
        location: 'Security Room',
        description: 'D-Link 1210-28P Switch • 12-Core Fiber from SR LIU 2 • PoE Enabled • Manageable',
        devices: {
            42: {
                deviceId: 'LIU-G2C-001',
                deviceType: 'liu',
                portCount: 12,
                name: '12-Core Fiber LIU (From SR LIU 2)',
                details: 'Receives 12-core fiber from Server Room LIU 2',
                ports: {
                    'LIU-G2C-001-port-1': { number: 1, status: 'uplink', connectedTo: 'SR LIU 2 Port 13', notes: 'Uplink to Server Room' },
                    'LIU-G2C-001-port-2': { number: 2, status: 'uplink', connectedTo: 'SR LIU 2 Port 14', notes: 'Uplink to Server Room' },
                    'LIU-G2C-001-port-3': { number: 3, status: 'uplink', connectedTo: 'SR LIU 2 Port 15', notes: 'Uplink to Server Room' },
                    'LIU-G2C-001-port-4': { number: 4, status: 'uplink', connectedTo: 'SR LIU 2 Port 16', notes: 'Uplink to Server Room' }
                }
            },
            40: {
                deviceId: 'SW-G2C-001',
                deviceType: 'switch',
                portCount: 28,
                name: 'D-Link 1210-28P PoE Switch',
                details: 'MAC: 78-32-1B-1E-5E-66, Serial: S30R2H9005621, Asset: 743156'
            },
            38: {
                deviceId: 'PP-G2C-001',
                deviceType: 'patch-panel',
                portCount: 24,
                name: 'Patch Panel 1 (PP-1)',
                details: 'Field connections to various endpoints'
            },
            36: {
                deviceId: 'WIFI-G2C-001',
                deviceType: 'wifi',
                portCount: 2,
                name: 'D-Link DAP-2230 WiFi AP',
                details: 'Asset ID: 7ef5f5, Connected to Switch Ports 3&4'
            },
            3: {
                deviceId: 'UPS-G2C-001',
                deviceType: 'ups',
                portCount: 0,
                name: 'BPE 650VA UPS',
                details: 'Asset ID: aa2e17'
            },
            2: {
                deviceId: 'PS-G2C-001',
                deviceType: 'power',
                portCount: 6,
                name: 'Wago Power Strip',
                details: 'With MCB & Rocker Switch, Asset ID: W/MCB'
            }
        },
        stats: {
            utilization: 65,
            totalConnections: 8,
            activeDevices: 6,
            powerConsumption: '1.2kW'
        }
    },
    
    'G2B': {
        id: 'G2B',
        name: 'Gate 2B Network Rack',
        location: 'Security Checkpoint',
        description: 'Direct fiber connection from SR • Access control & CCTV infrastructure',
        devices: {
            42: {
                deviceId: 'LIU-G2B-001',
                deviceType: 'liu',
                portCount: 8,
                name: 'Direct Fiber Interface',
                details: 'Direct 4-core fiber connection from Server Room LIU 2'
            },
            40: {
                deviceId: 'SW-G2B-001',
                deviceType: 'switch',
                portCount: 24,
                name: 'Access Switch G2B',
                details: 'D-Link DGS-1024D - 24-Port Unmanaged Switch'
            },
            38: {
                deviceId: 'CCTV-G2B-001',
                deviceType: 'cctv',
                portCount: 4,
                name: 'CCTV NVR System',
                details: 'Network Video Recorder - 4 Camera Channels'
            },
            36: {
                deviceId: 'AC-G2B-001',
                deviceType: 'generic',
                portCount: 2,
                name: 'Access Control Panel',
                details: 'Card reader and barrier control interface'
            },
            34: {
                deviceId: 'INTERCOM-G2B-001',
                deviceType: 'generic',
                portCount: 1,
                name: 'Intercom System',
                details: 'IP-based intercom for gate communication'
            },
            3: {
                deviceId: 'UPS-G2B-001',
                deviceType: 'ups',
                portCount: 0,
                name: 'APC Back-UPS 650VA',
                details: 'Local UPS for Gate 2B critical equipment'
            }
        },
        stats: {
            utilization: 45,
            totalConnections: 6,
            activeDevices: 6,
            powerConsumption: '0.8kW'
        }
    }
};

// Inter-rack connections based on rack2c.txt
const interRackConnections = [
    {
        id: 'fiber-sr-g2c-1',
        type: 'fiber',
        from: { rack: 'SR', device: 'LIU-SR-002', port: 13 },
        to: { rack: 'G2C', device: 'LIU-G2C-001', port: 1 },
        description: '12-Core Fiber - Core 1',
        bandwidth: '10Gbps',
        status: 'active'
    },
    {
        id: 'fiber-sr-g2c-2',
        type: 'fiber',
        from: { rack: 'SR', device: 'LIU-SR-002', port: 14 },
        to: { rack: 'G2C', device: 'LIU-G2C-001', port: 2 },
        description: '12-Core Fiber - Core 2',
        bandwidth: '10Gbps',
        status: 'active'
    },
    {
        id: 'fiber-sr-g2c-3',
        type: 'fiber',
        from: { rack: 'SR', device: 'LIU-SR-002', port: 15 },
        to: { rack: 'G2C', device: 'LIU-G2C-001', port: 3 },
        description: '12-Core Fiber - Core 3',
        bandwidth: '10Gbps',
        status: 'active'
    },
    {
        id: 'fiber-sr-g2c-4',
        type: 'fiber',
        from: { rack: 'SR', device: 'LIU-SR-002', port: 16 },
        to: { rack: 'G2C', device: 'LIU-G2C-001', port: 4 },
        description: '12-Core Fiber - Core 4',
        bandwidth: '10Gbps',
        status: 'active'
    },
    {
        id: 'fiber-sr-g2b-1',
        type: 'fiber',
        from: { rack: 'SR', device: 'LIU-SR-002', port: 17 },
        to: { rack: 'G2B', device: 'SW-G2B-001', port: 1 },
        description: 'Direct Fiber to Gate 2B - Core 1',
        bandwidth: '1Gbps',
        status: 'active'
    },
    {
        id: 'fiber-sr-g2b-2',
        type: 'fiber',
        from: { rack: 'SR', device: 'LIU-SR-002', port: 18 },
        to: { rack: 'G2B', device: 'SW-G2B-001', port: 2 },
        description: 'Direct Fiber to Gate 2B - Core 2',
        bandwidth: '1Gbps',
        status: 'active'
    }
];

// Initialize topology view
function initializeTopology() {
    console.log('🌐 Initializing Network Topology View...');
    
    // Load saved rack positions and connection endpoints
    const hasSavedPositions = loadRackPositions();
    const hasSavedEndpoints = loadConnectionEndpoints();
    
    // Populate rack list
    populateRackList();
    
    // Initialize drag functionality for racks
    initializeDragFunctionality();
    
    // Apply saved positions if they exist
    if (hasSavedPositions) {
        applySavedPositions();
    }
    
    // Draw inter-rack connections (only once, not on drag)
    drawInterRackConnections();
    
    // Initialize draggable connection endpoints
    initializeConnectionDragging();
    
    // Update connection summary
    updateConnectionSummary();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('✅ Network Topology View initialized');
}

// Initialize drag functionality for rack nodes
function initializeDragFunctionality() {
    const rackNodes = document.querySelectorAll('.rack-node');
    
    rackNodes.forEach(rackNode => {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        const rackId = rackNode.dataset.rackId;
        
        // Mouse down event
        rackNode.addEventListener('mousedown', (e) => {
            // Prevent dragging if clicking on interactive elements
            if (e.target.closest('button') || e.target.closest('.rack-stats') || e.target.closest('.btn-view-details')) {
                return;
            }
            
            isDragging = true;
            rackNode.classList.add('dragging');
            
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = rackNode.getBoundingClientRect();
            const canvasRect = rackNode.parentElement.getBoundingClientRect();
            
            initialLeft = rect.left - canvasRect.left;
            initialTop = rect.top - canvasRect.top;
            
            rackNode.style.cursor = 'grabbing';
            rackNode.style.zIndex = '1000';
            
            e.preventDefault();
        });
        
        // Mouse move event (attached to document for better tracking)
        document.addEventListener('mousemove', (e) => {
            if (!isDragging || !rackNode.classList.contains('dragging')) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const newLeft = initialLeft + deltaX;
            const newTop = initialTop + deltaY;
            
            // Constrain to canvas bounds
            const canvas = document.getElementById('topologyCanvas');
            const canvasRect = canvas.getBoundingClientRect();
            const rackRect = rackNode.getBoundingClientRect();
            
            const maxLeft = canvasRect.width - rackRect.width;
            const maxTop = canvasRect.height - rackRect.height;
            
            const constrainedLeft = Math.max(0, Math.min(newLeft, maxLeft));
            const constrainedTop = Math.max(0, Math.min(newTop, maxTop));
            
            rackNode.style.left = constrainedLeft + 'px';
            rackNode.style.top = constrainedTop + 'px';
            rackNode.style.right = 'auto';
            rackNode.style.bottom = 'auto';
            rackNode.style.transform = 'none';
            
            // DO NOT redraw connections during drag - keep them separate
        });
        
        // Mouse up event (attached to document)
        document.addEventListener('mouseup', (e) => {
            if (isDragging && rackNode.classList.contains('dragging')) {
                isDragging = false;
                
                // Save the new position
                rackPositions[rackId] = {
                    left: rackNode.style.left,
                    top: rackNode.style.top
                };
                saveRackPositions();
                
                // Small delay to prevent click event from firing
                setTimeout(() => {
                    rackNode.classList.remove('dragging');
                }, 100);
                
                rackNode.style.cursor = 'grab';
                rackNode.style.zIndex = '10';
                
                console.log(`Rack ${rackId} moved and saved to position:`, rackPositions[rackId]);
            }
        });
        
        // Add visual feedback for draggable elements
        rackNode.style.cursor = 'grab';
        rackNode.title = 'Click to view details • Drag to reposition';
    });
}

// Populate rack list in control panel
function populateRackList() {
    const rackList = document.getElementById('rackList');
    rackList.innerHTML = '';
    
    Object.values(rackConfigurations).forEach(rack => {
        const rackItem = document.createElement('div');
        rackItem.className = 'rack-list-item';
        rackItem.dataset.rackId = rack.id;
        rackItem.onclick = () => selectRack(rack.id);
        
        rackItem.innerHTML = `
            <div class="rack-name">${rack.name}</div>
            <div class="rack-location">${rack.location}</div>
        `;
        
        rackList.appendChild(rackItem);
    });
}

// Select a rack and navigate to drill-down view
function selectRack(rackId) {
    console.log('🎯 Navigating to rack:', rackId);
    
    // Store current topology state for back navigation
    sessionStorage.setItem('topologyView', JSON.stringify({
        selectedRack: rackId,
        returnUrl: window.location.href,
        timestamp: new Date().toISOString()
    }));
    
    // Navigate directly to rack-specific view
    const rackPages = {
        'G2C': 'rack-manager-g2c.html',
        'SR': 'rack-manager-sr.html',
        'G2B': 'rack-manager-g2b.html'
    };
    
    const targetPage = rackPages[rackId];
    if (targetPage) {
        console.log('Navigating to:', targetPage);
        window.location.href = targetPage;
    } else {
        console.error('No page found for rack:', rackId);
        alert(`No detailed view available for rack: ${rackId}`);
    }
}

// Show rack details in panel
function showRackDetails(rackId) {
    const rack = rackConfigurations[rackId];
    if (!rack) return;
    
    const panel = document.getElementById('rackDetailPanel');
    const title = document.getElementById('detailPanelTitle');
    const locationInfo = document.getElementById('locationInfo');
    const equipmentSummary = document.getElementById('equipmentSummary');
    const connectionDetails = document.getElementById('connectionDetails');
    
    // Update panel title
    title.textContent = `${rack.name} - ${rack.location}`;
    
    // Update location information
    locationInfo.innerHTML = `
        <div style="margin-bottom: 0.5rem;"><strong>Location:</strong> ${rack.location}</div>
        <div style="margin-bottom: 0.5rem;"><strong>Description:</strong> ${rack.description}</div>
        <div style="margin-bottom: 0.5rem;"><strong>Utilization:</strong> ${rack.stats.utilization}%</div>
        <div><strong>Power Consumption:</strong> ${rack.stats.powerConsumption}</div>
    `;
    
    // Update equipment summary
    const deviceCount = Object.keys(rack.devices).length;
    const deviceTypes = {};
    Object.values(rack.devices).forEach(device => {
        deviceTypes[device.deviceType] = (deviceTypes[device.deviceType] || 0) + 1;
    });
    
    let equipmentHTML = `<div style="margin-bottom: 0.5rem;"><strong>Total Devices:</strong> ${deviceCount}</div>`;
    Object.entries(deviceTypes).forEach(([type, count]) => {
        const typeName = type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
        equipmentHTML += `<div style="margin-bottom: 0.25rem;">• ${typeName}: ${count}</div>`;
    });
    equipmentSummary.innerHTML = equipmentHTML;
    
    // Update connection details
    const rackConnections = interRackConnections.filter(conn => 
        conn.from.rack === rackId || conn.to.rack === rackId
    );
    
    let connectionsHTML = `<div style="margin-bottom: 0.5rem;"><strong>Inter-Rack Connections:</strong> ${rackConnections.length}</div>`;
    rackConnections.forEach(conn => {
        const isSource = conn.from.rack === rackId;
        const otherRack = isSource ? conn.to.rack : conn.from.rack;
        const direction = isSource ? '→' : '←';
        
        connectionsHTML += `
            <div style="margin-bottom: 0.5rem; padding: 0.5rem; background: #f0f9ff; border-radius: 4px; border-left: 3px solid #4299e1;">
                <div style="font-weight: 500;">${direction} ${rackConfigurations[otherRack].name}</div>
                <div style="font-size: 0.8rem; color: #4a5568;">${conn.description}</div>
                <div style="font-size: 0.75rem; color: #718096;">Bandwidth: ${conn.bandwidth} • Status: ${conn.status}</div>
            </div>
        `;
    });
    connectionDetails.innerHTML = connectionsHTML;
    
    // Show panel
    panel.classList.add('open');
}

// Close detail panel
function closeDetailPanel() {
    document.getElementById('rackDetailPanel').classList.remove('open');
    selectedRack = null;
    
    // Clear rack selections
    document.querySelectorAll('.rack-list-item').forEach(item => {
        item.classList.remove('selected');
    });
    document.querySelectorAll('.rack-node').forEach(node => {
        node.classList.remove('selected');
    });
    
    // Clear connection highlighting
    clearConnectionHighlighting();
}

// Draw inter-rack connections with cable bundles and fiber fanouts
function drawInterRackConnections() {
    if (!connectionsVisible) return;
    
    const svg = document.getElementById('topologyConnections');
    svg.innerHTML = '';
    
    // Create arrow markers for cable bundles
    createArrowMarkers(svg);
    
    // Group connections by cable bundle
    const cableBundles = groupConnectionsByBundle();
    
    // Draw each cable bundle with fiber fanouts
    Object.values(cableBundles).forEach(bundle => {
        drawSimpleCableBundle(bundle);
    });
}

// Draw simple cable bundle with better arrow positioning
function drawSimpleCableBundle(bundle) {
    const svg = document.getElementById('topologyConnections');
    
    // Get rack positions
    const fromRack = document.getElementById(`rack-${bundle.from}`);
    const toRack = document.getElementById(`rack-${bundle.to}`);
    
    if (!fromRack || !toRack) {
        console.log('Racks not found:', bundle.from, bundle.to);
        return;
    }
    
    const fromRect = fromRack.getBoundingClientRect();
    const toRect = toRack.getBoundingClientRect();
    const canvasRect = document.getElementById('topologyCanvas').getBoundingClientRect();
    
    // Check if we have custom endpoints saved
    const bundleKey = `${bundle.from}-${bundle.to}`;
    let fromX, fromY, toX, toY;
    
    if (connectionEndpoints[bundleKey]) {
        // Use saved custom endpoints
        fromX = connectionEndpoints[bundleKey].fromX;
        fromY = connectionEndpoints[bundleKey].fromY;
        toX = connectionEndpoints[bundleKey].toX;
        toY = connectionEndpoints[bundleKey].toY;
    } else {
        // Calculate default connection points
        if (bundle.from === 'SR' && bundle.to === 'G2C') {
            fromX = (fromRect.right - canvasRect.left) - 16;
            fromY = (fromRect.top - canvasRect.top) + fromRect.height / 2;
            toX = (toRect.left - canvasRect.left) + 16;
            toY = (toRect.top - canvasRect.top) + toRect.height / 2;
        } else if (bundle.from === 'SR' && bundle.to === 'G2B') {
            fromX = (fromRect.right - canvasRect.left) - 20;
            fromY = (fromRect.bottom - canvasRect.top) - 20;
            toX = (toRect.right - canvasRect.left) - 20;
            toY = (toRect.top - canvasRect.top) - 20;
        } else {
            console.log('Unknown bundle combination:', bundle.from, bundle.to);
            return;
        }
        
        // Save default endpoints
        connectionEndpoints[bundleKey] = { fromX, fromY, toX, toY };
    }
    
    console.log(`Drawing bundle from (${fromX}, ${fromY}) to (${toX}, ${toY})`);
    
    // Create main cable path with better curve control
    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    
    let mainPathData;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        const controlOffset = Math.min(Math.abs(deltaX) * 0.3, 80);
        const control1X = fromX + (deltaX > 0 ? controlOffset : -controlOffset);
        const control1Y = fromY;
        const control2X = toX - (deltaX > 0 ? controlOffset : -controlOffset);
        const control2Y = toY;
        mainPathData = `M ${fromX} ${fromY} C ${control1X} ${control1Y} ${control2X} ${control2Y} ${toX} ${toY}`;
    } else {
        const controlOffset = Math.min(Math.abs(deltaY) * 0.4, 80);
        const control1X = fromX;
        const control1Y = fromY + (deltaY > 0 ? controlOffset : -controlOffset);
        const control2X = toX;
        const control2Y = toY - (deltaY > 0 ? controlOffset + 15 : -controlOffset);
        mainPathData = `M ${fromX} ${fromY} C ${control1X} ${control1Y} ${control2X} ${control2Y} ${toX} ${toY}`;
    }
    
    // Create bundle group
    const bundleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    bundleGroup.setAttribute('class', 'cable-bundle-group');
    bundleGroup.setAttribute('data-bundle-id', bundle.id);
    
    // Main cable bundle path
    const mainCable = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mainCable.setAttribute('d', mainPathData);
    mainCable.setAttribute('class', 'main-cable-bundle');
    mainCable.setAttribute('stroke', '#2d3748');
    mainCable.setAttribute('stroke-width', Math.min(bundle.coreCount + 4, 12));
    mainCable.setAttribute('fill', 'none');
    mainCable.setAttribute('opacity', '0.8');
    mainCable.setAttribute('stroke-linecap', 'round');
    mainCable.setAttribute('marker-end', 'url(#arrow-cable-bundle)');
    
    bundleGroup.appendChild(mainCable);
    
    // Draw visible fiber fanouts
    drawVisibleFiberFanouts(bundleGroup, fromX, fromY, toX, toY, bundle.coreCount, bundle.from, bundle.to);
    
    // Add draggable control points at both ends
    addDraggableEndpoint(bundleGroup, fromX, fromY, bundleKey, 'from');
    addDraggableEndpoint(bundleGroup, toX, toY, bundleKey, 'to');
    
    // Add bundle label
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    
    const bundleLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    bundleLabel.setAttribute('x', midX);
    bundleLabel.setAttribute('y', midY - 20);
    bundleLabel.setAttribute('class', 'connection-label');
    bundleLabel.setAttribute('style', 'font-weight: bold; font-size: 0.85rem; fill: #2d3748;');
    bundleLabel.textContent = `${bundle.coreCount}-Core Fiber`;
    
    const bundleLabelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const labelWidth = bundleLabel.textContent.length * 7 + 12;
    bundleLabelBg.setAttribute('x', midX - labelWidth / 2);
    bundleLabelBg.setAttribute('y', midY - 30);
    bundleLabelBg.setAttribute('width', labelWidth);
    bundleLabelBg.setAttribute('height', 16);
    bundleLabelBg.setAttribute('fill', 'rgba(255, 255, 255, 0.95)');
    bundleLabelBg.setAttribute('stroke', '#2d3748');
    bundleLabelBg.setAttribute('stroke-width', '1');
    bundleLabelBg.setAttribute('rx', '3');
    
    bundleGroup.appendChild(bundleLabelBg);
    bundleGroup.appendChild(bundleLabel);
    
    // Add hover effects
    bundleGroup.addEventListener('mouseenter', () => {
        mainCable.setAttribute('opacity', '1');
        mainCable.setAttribute('stroke-width', Math.min(bundle.coreCount + 6, 14));
        showBundleTooltip(bundle, midX, midY + 15);
    });
    
    bundleGroup.addEventListener('mouseleave', () => {
        mainCable.setAttribute('opacity', '0.8');
        mainCable.setAttribute('stroke-width', Math.min(bundle.coreCount + 4, 12));
        hideBundleTooltip();
    });
    
    svg.appendChild(bundleGroup);
    console.log('Bundle group added to SVG');
}

// Add draggable endpoint control point
function addDraggableEndpoint(parentGroup, x, y, bundleKey, endType) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', '10');
    circle.setAttribute('fill', '#4299e1');
    circle.setAttribute('stroke', 'white');
    circle.setAttribute('stroke-width', '3');
    circle.setAttribute('opacity', '0.8');
    circle.setAttribute('class', 'connection-endpoint');
    circle.setAttribute('data-bundle-key', bundleKey);
    circle.setAttribute('data-end-type', endType);
    circle.style.cursor = 'move';
    circle.style.pointerEvents = 'all';
    
    // Add title for better UX
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `Drag to adjust ${endType} endpoint`;
    circle.appendChild(title);
    
    parentGroup.appendChild(circle);
}

// Initialize connection endpoint dragging
function initializeConnectionDragging() {
    const svg = document.getElementById('topologyConnections');
    let draggedEndpoint = null;
    let isDraggingEndpoint = false;
    
    // Use event delegation on the SVG
    svg.addEventListener('mousedown', (e) => {
        const target = e.target;
        if (target.classList.contains('connection-endpoint')) {
            draggedEndpoint = target;
            isDraggingEndpoint = true;
            draggedEndpoint.setAttribute('opacity', '1');
            draggedEndpoint.setAttribute('r', '12');
            draggedEndpoint.setAttribute('fill', '#3182ce');
            e.stopPropagation();
            e.preventDefault();
            console.log('Started dragging endpoint');
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDraggingEndpoint || !draggedEndpoint) return;
        
        const svgRect = svg.getBoundingClientRect();
        const newX = e.clientX - svgRect.left;
        const newY = e.clientY - svgRect.top;
        
        // Update circle position
        draggedEndpoint.setAttribute('cx', newX);
        draggedEndpoint.setAttribute('cy', newY);
        
        // Update saved endpoint position
        const bundleKey = draggedEndpoint.getAttribute('data-bundle-key');
        const endType = draggedEndpoint.getAttribute('data-end-type');
        
        if (!connectionEndpoints[bundleKey]) {
            connectionEndpoints[bundleKey] = {};
        }
        
        if (endType === 'from') {
            connectionEndpoints[bundleKey].fromX = newX;
            connectionEndpoints[bundleKey].fromY = newY;
        } else {
            connectionEndpoints[bundleKey].toX = newX;
            connectionEndpoints[bundleKey].toY = newY;
        }
        
        // Redraw connections to show updated position
        drawInterRackConnections();
        
        e.preventDefault();
    });
    
    document.addEventListener('mouseup', (e) => {
        if (isDraggingEndpoint && draggedEndpoint) {
            draggedEndpoint.setAttribute('opacity', '0.8');
            draggedEndpoint.setAttribute('r', '10');
            draggedEndpoint.setAttribute('fill', '#4299e1');
            
            // Save to localStorage
            saveConnectionEndpoints();
            
            console.log('Finished dragging endpoint, saved position');
            
            isDraggingEndpoint = false;
            draggedEndpoint = null;
        }
    });
    
    console.log('Connection endpoint dragging initialized');
}

// Draw visible fiber fanouts - simplified approach with correct directions
function drawVisibleFiberFanouts(parentGroup, fromX, fromY, toX, toY, coreCount, fromRack, toRack) {
    const coreColors = ['#f6ad55', '#ed8936', '#f6e05e', '#fbb6ce', '#fc8181', '#f093fb'];
    const fanoutLength = 13; // Reduced by another 20% (was 16, now ~13)
    const fanoutSpread = 6;
    
    console.log(`Drawing ${coreCount} fiber fanouts from (${fromX},${fromY}) to (${toX},${toY})`);
    
    // Draw fanouts at source (fromX, fromY) - going TOWARD the SR rack
    for (let i = 0; i < coreCount; i++) {
        const offset = (i - (coreCount - 1) / 2) * fanoutSpread;
        let startX, startY, endX, endY;
        
        if (fromRack === 'SR' && toRack === 'G2C') {
            // Horizontal - fanout to the LEFT toward SR rack edge
            startX = fromX;
            startY = fromY + offset;
            endX = fromX - fanoutLength;
            endY = fromY + offset;
        } else if (fromRack === 'SR' && toRack === 'G2B') {
            // Diagonal - fanout toward bottom-right corner of SR rack
            startX = fromX;
            startY = fromY;
            endX = fromX + fanoutLength * 0.7; // Go diagonally right
            endY = fromY + fanoutLength * 0.7; // Go diagonally down
        } else {
            continue;
        }
        
        // Create fiber line
        const fiberLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        fiberLine.setAttribute('x1', startX);
        fiberLine.setAttribute('y1', startY);
        fiberLine.setAttribute('x2', endX);
        fiberLine.setAttribute('y2', endY);
        fiberLine.setAttribute('stroke', coreColors[i % coreColors.length]);
        fiberLine.setAttribute('stroke-width', '2.5');
        fiberLine.setAttribute('stroke-linecap', 'round');
        fiberLine.setAttribute('opacity', '0.9');
        
        // Create end circle
        const endCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        endCircle.setAttribute('cx', endX);
        endCircle.setAttribute('cy', endY);
        endCircle.setAttribute('r', '3');
        endCircle.setAttribute('fill', coreColors[i % coreColors.length]);
        endCircle.setAttribute('stroke', 'white');
        endCircle.setAttribute('stroke-width', '1.5');
        
        // Create label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', endX + (fromRack === 'SR' && toRack === 'G2C' ? 10 : 0));
        label.setAttribute('y', endY + (fromRack === 'SR' && toRack === 'G2B' ? 12 : 4));
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('style', `font-size: 0.6rem; font-weight: 700; fill: ${coreColors[i % coreColors.length]};`);
        label.textContent = `C${i + 1}`;
        
        parentGroup.appendChild(fiberLine);
        parentGroup.appendChild(endCircle);
        parentGroup.appendChild(label);
    }
    
    // Draw fanouts at destination (toX, toY) - going TOWARD the destination rack
    for (let i = 0; i < coreCount; i++) {
        const offset = (i - (coreCount - 1) / 2) * fanoutSpread;
        let startX, startY, endX, endY;
        
        if (fromRack === 'SR' && toRack === 'G2C') {
            // Horizontal - fanout to the RIGHT toward G2C rack edge
            startX = toX;
            startY = toY + offset;
            endX = toX + fanoutLength;
            endY = toY + offset;
        } else if (fromRack === 'SR' && toRack === 'G2B') {
            // Diagonal - fanout toward top-right corner of G2B rack
            startX = toX;
            startY = toY;
            endX = toX + fanoutLength * 0.7; // Go diagonally right
            endY = toY - fanoutLength * 0.7; // Go diagonally up
        } else {
            continue;
        }
        
        // Create fiber line
        const fiberLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        fiberLine.setAttribute('x1', startX);
        fiberLine.setAttribute('y1', startY);
        fiberLine.setAttribute('x2', endX);
        fiberLine.setAttribute('y2', endY);
        fiberLine.setAttribute('stroke', coreColors[i % coreColors.length]);
        fiberLine.setAttribute('stroke-width', '2.5');
        fiberLine.setAttribute('stroke-linecap', 'round');
        fiberLine.setAttribute('opacity', '0.9');
        
        // Create end circle
        const endCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        endCircle.setAttribute('cx', endX);
        endCircle.setAttribute('cy', endY);
        endCircle.setAttribute('r', '3');
        endCircle.setAttribute('fill', coreColors[i % coreColors.length]);
        endCircle.setAttribute('stroke', 'white');
        endCircle.setAttribute('stroke-width', '1.5');
        
        // Create label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', endX + (fromRack === 'SR' && toRack === 'G2C' ? -10 : 0));
        label.setAttribute('y', endY + (fromRack === 'SR' && toRack === 'G2B' ? -8 : 4));
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('style', `font-size: 0.6rem; font-weight: 700; fill: ${coreColors[i % coreColors.length]};`);
        label.textContent = `C${i + 1}`;
        
        parentGroup.appendChild(fiberLine);
        parentGroup.appendChild(endCircle);
        parentGroup.appendChild(label);
    }
    
    console.log(`Added ${coreCount * 2} fanout elements (${coreCount} at each end)`);
}



// Create SVG arrow markers
function createArrowMarkers(svg) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Cable bundle arrow (smaller size)
    const cableBundleMarker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    cableBundleMarker.setAttribute('id', 'arrow-cable-bundle');
    cableBundleMarker.setAttribute('viewBox', '0 0 10 10');
    cableBundleMarker.setAttribute('refX', '10');
    cableBundleMarker.setAttribute('refY', '5');
    cableBundleMarker.setAttribute('markerWidth', '6');
    cableBundleMarker.setAttribute('markerHeight', '6');
    cableBundleMarker.setAttribute('orient', 'auto');
    cableBundleMarker.setAttribute('markerUnits', 'strokeWidth');
    
    const cableBundlePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    cableBundlePath.setAttribute('d', 'M0,0 L0,10 L10,5 z');
    cableBundlePath.setAttribute('fill', '#2d3748');
    cableBundlePath.setAttribute('class', 'connection-arrow cable-bundle');
    
    cableBundleMarker.appendChild(cableBundlePath);
    defs.appendChild(cableBundleMarker);
    
    // Standard connection type arrows
    const connectionTypes = [
        { type: 'fiber', color: '#f6ad55' },
        { type: 'ethernet', color: '#4299e1' },
        { type: 'power', color: '#e53e3e' },
        { type: 'management', color: '#9f7aea' }
    ];
    
    connectionTypes.forEach(({ type, color }) => {
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', `arrow-${type}`);
        marker.setAttribute('viewBox', '0 0 10 10');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3');
        marker.setAttribute('markerWidth', '6');
        marker.setAttribute('markerHeight', '6');
        marker.setAttribute('orient', 'auto');
        marker.setAttribute('markerUnits', 'strokeWidth');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M0,0 L0,6 L9,3 z');
        path.setAttribute('fill', color);
        path.setAttribute('class', `connection-arrow ${type}`);
        
        marker.appendChild(path);
        defs.appendChild(marker);
    });
    
    svg.appendChild(defs);
}

// Group connections by cable bundle (same source and destination racks)
function groupConnectionsByBundle() {
    const bundles = {};
    
    interRackConnections.forEach(connection => {
        const bundleKey = `${connection.from.rack}-${connection.to.rack}`;
        if (!bundles[bundleKey]) {
            bundles[bundleKey] = {
                id: bundleKey,
                from: connection.from.rack,
                to: connection.to.rack,
                connections: [],
                coreCount: 0
            };
        }
        bundles[bundleKey].connections.push(connection);
        bundles[bundleKey].coreCount++;
    });
    
    return bundles;
}


// Show bundle tooltip
function showBundleTooltip(bundle, x, y) {
    console.log(`📋 Cable Bundle: ${bundle.coreCount} fiber cores from ${rackConfigurations[bundle.from].name} to ${rackConfigurations[bundle.to].name}`);
    
    // Create tooltip element if it doesn't exist
    let tooltip = document.getElementById('bundle-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'bundle-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(45, 55, 72, 0.95);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.8rem;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            backdrop-filter: blur(4px);
        `;
        document.body.appendChild(tooltip);
    }
    
    tooltip.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 4px;">${bundle.coreCount}-Core Fiber Cable</div>
        <div style="font-size: 0.7rem; opacity: 0.9;">
            ${rackConfigurations[bundle.from].name} → ${rackConfigurations[bundle.to].name}
        </div>
        <div style="font-size: 0.7rem; opacity: 0.8; margin-top: 2px;">
            ${bundle.connections.length} active connections
        </div>
    `;
    
    tooltip.style.left = (x + 10) + 'px';
    tooltip.style.top = (y - 40) + 'px';
    tooltip.style.display = 'block';
}

// Hide bundle tooltip
function hideBundleTooltip() {
    const tooltip = document.getElementById('bundle-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// Highlight connections for a specific rack
function highlightRackConnections(rackId) {
    // Clear previous highlighting
    clearConnectionHighlighting();
    
    // Highlight connections involving this rack
    const rackConnections = interRackConnections.filter(conn => 
        conn.from.rack === rackId || conn.to.rack === rackId
    );
    
    rackConnections.forEach(conn => {
        const connectionElement = document.querySelector(`[data-connection-id="${conn.id}"]`);
        if (connectionElement) {
            const path = connectionElement.querySelector('.connection-line');
            path.classList.add('highlighted');
        }
        
        // Highlight connected racks
        const otherRackId = conn.from.rack === rackId ? conn.to.rack : conn.from.rack;
        const otherRackNode = document.getElementById(`rack-${otherRackId}`);
        if (otherRackNode) {
            otherRackNode.classList.add('connected');
        }
    });
}

// Clear connection highlighting
function clearConnectionHighlighting() {
    document.querySelectorAll('.connection-line').forEach(line => {
        line.classList.remove('highlighted');
    });
    
    document.querySelectorAll('.rack-node').forEach(node => {
        node.classList.remove('connected');
    });
}

// Update connection summary
function updateConnectionSummary() {
    const summary = document.getElementById('connectionSummary');
    
    const totalConnections = interRackConnections.length;
    const activeConnections = interRackConnections.filter(c => c.status === 'active').length;
    const fiberConnections = interRackConnections.filter(c => c.type === 'fiber').length;
    
    summary.innerHTML = `
        <div class="summary-item">
            <span>Total Connections:</span>
            <span>${totalConnections}</span>
        </div>
        <div class="summary-item">
            <span>Active:</span>
            <span>${activeConnections}</span>
        </div>
        <div class="summary-item">
            <span>Fiber Links:</span>
            <span>${fiberConnections}</span>
        </div>
        <div class="summary-item">
            <span>Total Bandwidth:</span>
            <span>42 Gbps</span>
        </div>
    `;
}

// Control functions
function showAllConnections() {
    connectionsVisible = true;
    drawInterRackConnections();
    console.log('🔗 Showing all connections');
}

function hideAllConnections() {
    connectionsVisible = false;
    document.getElementById('topologyConnections').innerHTML = '';
    console.log('👁️ Hiding all connections');
}

function toggleRackLabels() {
    rackLabelsVisible = !rackLabelsVisible;
    document.querySelectorAll('.rack-node').forEach(node => {
        if (rackLabelsVisible) {
            node.style.opacity = '1';
        } else {
            node.style.opacity = '0.7';
        }
    });
    console.log('🏷️ Toggled rack labels:', rackLabelsVisible);
}

function exportTopology() {
    const topologyData = {
        racks: rackConfigurations,
        connections: interRackConnections,
        positions: rackPositions,
        exportedAt: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(topologyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `network-topology-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    console.log('💾 Topology exported');
}

// Reset rack positions to default
function resetRackPositions() {
    if (confirm('Reset all rack positions and connection endpoints to default layout?')) {
        localStorage.removeItem('topologyRackPositions');
        localStorage.removeItem('topologyConnectionEndpoints');
        rackPositions = {};
        connectionEndpoints = {};
        location.reload();
        console.log('↺ Rack positions and connection endpoints reset');
    }
}

// Toggle legend visibility
function toggleLegend() {
    const legend = document.getElementById('connectionLegend');
    const toggleBtn = document.getElementById('legendToggleBtn');
    
    if (legend.style.display === 'none') {
        legend.style.display = 'block';
        toggleBtn.textContent = '📖 Hide Legend';
        console.log('Legend shown');
    } else {
        legend.style.display = 'none';
        toggleBtn.textContent = '📖 Legend';
        console.log('Legend hidden');
    }
}

// Drill down to individual rack view
function drillDownToRack() {
    if (!selectedRack) return;
    
    const rackPages = {
        'G2C': 'rack-manager-v4.html',
        'SR': 'rack-manager-v4.html', // Could be a server room specific version
        'G2B': 'rack-manager-v4.html'  // Could be a gate 2B specific version
    };
    
    const targetPage = rackPages[selectedRack];
    if (targetPage) {
        // Open in new tab to preserve topology view
        window.open(targetPage, '_blank');
        console.log('🔍 Drilling down to rack:', selectedRack);
    }
}

// Show rack connections
function showRackConnections() {
    if (!selectedRack) return;
    
    highlightRackConnections(selectedRack);
    console.log('🔗 Highlighting connections for rack:', selectedRack);
}

// Connection tooltip functions
function showConnectionTooltip(connection, x, y) {
    // Implementation for connection tooltip
    console.log('📋 Showing connection tooltip:', connection.description);
}

function hideConnectionTooltip() {
    // Implementation for hiding connection tooltip
}

// Setup event listeners
function setupEventListeners() {
    // Window resize handler
    window.addEventListener('resize', () => {
        setTimeout(() => {
            if (connectionsVisible) {
                drawInterRackConnections();
            }
        }, 100);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDetailPanel();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTopology();
    
    console.log('🌐 Network Topology View - Multi-Rack Infrastructure loaded');
});

// Export for debugging
window.topologyView = {
    getRackConfigurations: () => rackConfigurations,
    getConnections: () => interRackConnections,
    selectRack,
    exportTopology
};
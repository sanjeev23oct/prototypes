// Network Topology View JavaScript - Multi-Rack Infrastructure
// Built on v4 foundation with topology-specific enhancements

// Global state
let selectedRack = null;
let connectionsVisible = true;
let rackLabelsVisible = true;

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
    
    // Populate rack list
    populateRackList();
    
    // Draw inter-rack connections
    drawInterRackConnections();
    
    // Update connection summary
    updateConnectionSummary();
    
    // Setup event listeners
    setupEventListeners();
    
    // Add click event listeners to rack nodes (backup to onclick)
    document.querySelectorAll('.rack-node').forEach(node => {
        const rackId = node.dataset.rackId;
        console.log('Setting up click listener for rack:', rackId);
        
        node.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Rack clicked via event listener:', rackId);
            selectRack(rackId);
        });
    });
    
    console.log('✅ Network Topology View initialized');
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

// Draw inter-rack connections
function drawInterRackConnections() {
    if (!connectionsVisible) return;
    
    const svg = document.getElementById('topologyConnections');
    svg.innerHTML = '';
    
    interRackConnections.forEach(connection => {
        drawConnection(connection);
    });
}

// Draw individual connection with improved positioning
function drawConnection(connection) {
    const svg = document.getElementById('topologyConnections');
    
    // Get rack positions
    const fromRack = document.getElementById(`rack-${connection.from.rack}`);
    const toRack = document.getElementById(`rack-${connection.to.rack}`);
    
    if (!fromRack || !toRack) return;
    
    const fromRect = fromRack.getBoundingClientRect();
    const toRect = toRack.getBoundingClientRect();
    const canvasRect = document.getElementById('topologyCanvas').getBoundingClientRect();
    
    // Calculate connection points with better logic
    let fromX, fromY, toX, toY;
    
    // Determine optimal connection points based on rack positions
    if (connection.from.rack === 'SR' && connection.to.rack === 'G2C') {
        // Server Room to Gate 2C - connect right side of SR to left side of G2C
        fromX = (fromRect.right - canvasRect.left) - 10;
        fromY = (fromRect.top - canvasRect.top) + fromRect.height / 2;
        toX = (toRect.left - canvasRect.left) + 10;
        toY = (toRect.top - canvasRect.top) + toRect.height / 2;
    } else if (connection.from.rack === 'SR' && connection.to.rack === 'G2B') {
        // Server Room to Gate 2B - connect bottom of SR to top of G2B
        fromX = (fromRect.left - canvasRect.left) + fromRect.width / 2;
        fromY = (fromRect.bottom - canvasRect.top) - 10;
        toX = (toRect.left - canvasRect.left) + toRect.width / 2;
        toY = (toRect.top - canvasRect.top) + 10;
    } else if (connection.from.rack === 'G2C' && connection.to.rack === 'G2B') {
        // Gate 2C to Gate 2B - connect bottom-left of G2C to top-right of G2B
        fromX = (fromRect.left - canvasRect.left) + fromRect.width * 0.3;
        fromY = (fromRect.bottom - canvasRect.top) - 10;
        toX = (toRect.right - canvasRect.left) - fromRect.width * 0.3;
        toY = (toRect.top - canvasRect.top) + 10;
    } else {
        // Default center-to-center for any other connections
        fromX = (fromRect.left - canvasRect.left) + fromRect.width / 2;
        fromY = (fromRect.top - canvasRect.top) + fromRect.height / 2;
        toX = (toRect.left - canvasRect.left) + toRect.width / 2;
        toY = (toRect.top - canvasRect.top) + toRect.height / 2;
    }
    
    // Create smooth curved path with better control points
    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    let pathData;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal-dominant connection - use horizontal curve
        const controlOffset = Math.min(Math.abs(deltaX) * 0.4, 100);
        const control1X = fromX + (deltaX > 0 ? controlOffset : -controlOffset);
        const control1Y = fromY;
        const control2X = toX - (deltaX > 0 ? controlOffset : -controlOffset);
        const control2Y = toY;
        
        pathData = `M ${fromX} ${fromY} C ${control1X} ${control1Y} ${control2X} ${control2Y} ${toX} ${toY}`;
    } else {
        // Vertical-dominant connection - use vertical curve
        const controlOffset = Math.min(Math.abs(deltaY) * 0.4, 80);
        const control1X = fromX;
        const control1Y = fromY + (deltaY > 0 ? controlOffset : -controlOffset);
        const control2X = toX;
        const control2Y = toY - (deltaY > 0 ? controlOffset : -controlOffset);
        
        pathData = `M ${fromX} ${fromY} C ${control1X} ${control1Y} ${control2X} ${control2Y} ${toX} ${toY}`;
    }
    
    // Create connection group
    const connectionGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    connectionGroup.setAttribute('class', 'connection-group');
    connectionGroup.setAttribute('data-connection-id', connection.id);
    
    // Create connection path with better styling
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('class', `connection-line ${connection.type}`);
    
    // Create connection label with better positioning
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    
    // Adjust label position to avoid overlapping with the line
    const labelOffsetY = deltaY > 0 ? -20 : 20;
    const labelX = midX;
    const labelY = midY + labelOffsetY;
    
    // Simplified and cleaner label text
    let labelText = connection.description;
    if (labelText.includes('12-Core Fiber - Core')) {
        labelText = `Core ${labelText.split('Core ')[1]}`;
    } else if (labelText.includes('Direct Fiber to Gate 2B - Core')) {
        labelText = `G2B Core ${labelText.split('Core ')[1]}`;
    }
    
    const labelWidth = Math.max(labelText.length * 6 + 12, 60);
    
    // Label background
    const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    labelBg.setAttribute('x', labelX - labelWidth / 2);
    labelBg.setAttribute('y', labelY - 8);
    labelBg.setAttribute('width', labelWidth);
    labelBg.setAttribute('height', 16);
    labelBg.setAttribute('class', 'connection-label-bg');
    
    // Label text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', labelX);
    text.setAttribute('y', labelY);
    text.setAttribute('class', 'connection-label');
    text.textContent = labelText;
    
    // Add elements to group
    connectionGroup.appendChild(path);
    connectionGroup.appendChild(labelBg);
    connectionGroup.appendChild(text);
    
    // Add hover effects with improved tooltip
    connectionGroup.addEventListener('mouseenter', () => {
        path.classList.add('highlighted');
        showConnectionTooltip(connection, labelX, labelY + 30);
    });
    
    connectionGroup.addEventListener('mouseleave', () => {
        path.classList.remove('highlighted');
        hideConnectionTooltip();
    });
    
    svg.appendChild(connectionGroup);
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
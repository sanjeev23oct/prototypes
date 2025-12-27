// Gate 2C Rack Manager JavaScript
// Global state
let rackData = {};
let selectedPorts = [];
let connectionMode = false;
let dragPreview = null;
let connections = [];
let deviceCounter = 1;
let cableCounter = 1;
let cablesVisible = true;
let currentRackId = 'G2C';
let rackConfigurations = {};

// Initialize Gate 2C rack configuration based on rack2c.txt data
function initializeRackConfigurations() {
    rackConfigurations = {
        'G2C': {
            name: 'Gate 2C Network Rack - Security Room',
            details: 'D-Link 1210-28P Switch • 12-Core Fiber from SR LIU 2 • PoE Enabled • Manageable',
            location: 'Gate-2C Security Room',
            devices: {
                // LIU Panel (Unit 42)
                42: {
                    deviceId: 'LIU-G2C-001',
                    deviceType: 'patch-panel',
                    portCount: 12,
                    ports: {},
                    name: '12-Core Fiber LIU (From SR LIU 2)',
                    details: 'Ports 13-16 to Gate 2C Switch, Ports 17-20 direct to Gate 2B'
                },
                
                // Main Switch (Unit 40)
                40: {
                    deviceId: 'SW-G2C-001',
                    deviceType: 'switch',
                    portCount: 28,
                    ports: {},
                    name: 'D-Link 1210-28P PoE Switch',
                    details: 'MAC: 78-32-1B-1E-5E-66, Serial: S30R2H9005621, Asset: 743156'
                },
                
                // Patch Panel 1 (Unit 38)
                38: {
                    deviceId: 'PP-G2C-001',
                    deviceType: 'patch-panel',
                    portCount: 24,
                    ports: {},
                    name: 'Patch Panel 1 (PP-1)',
                    details: 'Field connections to various endpoints'
                },
                
                // WiFi Access Point (Unit 36)
                36: {
                    deviceId: 'WIFI-G2C-001',
                    deviceType: 'server',
                    portCount: 2,
                    ports: {},
                    name: 'D-Link DAP-2230 WiFi AP',
                    details: 'Asset ID: 7ef5f5, Connected to Switch Ports 3&4'
                },
                
                // UPS (Unit 3)
                3: {
                    deviceId: 'UPS-G2C-001',
                    deviceType: 'ups',
                    portCount: 0,
                    ports: {},
                    name: 'BPE 650VA UPS',
                    details: 'Asset ID: aa2e17'
                },
                
                // Power Strip (Unit 2)
                2: {
                    deviceId: 'PS-G2C-001',
                    deviceType: 'pdu',
                    portCount: 6,
                    ports: {},
                    name: 'Wago Power Strip',
                    details: 'With MCB & Rocker Switch, Asset ID: W/MCB'
                },
                
                // Power IOT Device (Unit 1)
                1: {
                    deviceId: 'IOT-G2C-001',
                    deviceType: 'server',
                    portCount: 2,
                    ports: {},
                    name: 'RSSB PM 201 Power IOT',
                    details: 'Asset ID: a4sh8d'
                }
            },
            connections: [
                // LIU to Switch connections
                {
                    id: 'conn-liu-sw-1',
                    portA: 'LIU-G2C-001-port-1',
                    portB: 'SW-G2C-001-port-1',
                    cableId: 'FIBER-G2C-001',
                    connectionType: 'fiber',
                    cableLength: 2.0,
                    status: 'active',
                    description: 'SR LIU 2 Port 13 to Gate 2C Switch Port 1'
                },
                {
                    id: 'conn-liu-sw-2',
                    portA: 'LIU-G2C-001-port-2',
                    portB: 'SW-G2C-001-port-2',
                    cableId: 'FIBER-G2C-002',
                    connectionType: 'fiber',
                    cableLength: 2.0,
                    status: 'active',
                    description: 'SR LIU 2 Port 14 to Gate 2C Switch Port 2'
                },
                {
                    id: 'conn-liu-sw-3',
                    portA: 'LIU-G2C-001-port-3',
                    portB: 'SW-G2C-001-port-4',
                    cableId: 'FIBER-G2C-003',
                    connectionType: 'fiber',
                    cableLength: 2.0,
                    status: 'active',
                    description: 'SR LIU 2 Port 15 to Gate 2C Switch Port 4'
                },
                {
                    id: 'conn-liu-sw-4',
                    portA: 'LIU-G2C-001-port-4',
                    portB: 'SW-G2C-001-port-6',
                    cableId: 'FIBER-G2C-004',
                    connectionType: 'fiber',
                    cableLength: 2.0,
                    status: 'active',
                    description: 'SR LIU 2 Port 16 to Gate 2C Switch Port 6'
                },
                
                // Switch to WiFi connections
                {
                    id: 'conn-sw-wifi-1',
                    portA: 'SW-G2C-001-port-3',
                    portB: 'WIFI-G2C-001-port-1',
                    cableId: 'CAT6-WIFI-001',
                    connectionType: 'ethernet',
                    cableLength: 3.0,
                    status: 'active',
                    description: 'Switch Port 3 to WiFi AP'
                },
                
                // Switch to Patch Panel connections
                {
                    id: 'conn-sw-pp-1',
                    portA: 'SW-G2C-001-port-8',
                    portB: 'PP-G2C-001-port-15',
                    cableId: 'CAT6-PP-001',
                    connectionType: 'ethernet',
                    cableLength: 1.5,
                    status: 'active',
                    description: 'Switch Port 8 to PP Port 15 (CCTV)'
                },
                {
                    id: 'conn-sw-pp-2',
                    portA: 'SW-G2C-001-port-10',
                    portB: 'PP-G2C-001-port-16',
                    cableId: 'CAT6-PP-002',
                    connectionType: 'ethernet',
                    cableLength: 1.5,
                    status: 'active',
                    description: 'Switch Port 10 to PP Port 16 (Road/Dera Mor)'
                },
                {
                    id: 'conn-sw-pp-3',
                    portA: 'SW-G2C-001-port-12',
                    portB: 'PP-G2C-001-port-17',
                    cableId: 'CAT6-PP-003',
                    connectionType: 'ethernet',
                    cableLength: 1.5,
                    status: 'active',
                    description: 'Switch Port 12 to PP Port 17 (CCTV)'
                },
                {
                    id: 'conn-sw-pp-4',
                    portA: 'SW-G2C-001-port-14',
                    portB: 'PP-G2C-001-port-18',
                    cableId: 'CAT6-PP-004',
                    connectionType: 'ethernet',
                    cableLength: 1.5,
                    status: 'active',
                    description: 'Switch Port 14 to PP Port 18 (CCTV)'
                }
            ],
            // Port mapping information for detailed tooltips
            portMappings: {
                // Switch port mappings
                'SW-G2C-001-port-1': {
                    uplink: true,
                    mapping: 'LIU Port 1 → SR LIU 2 Port 13',
                    endDevice: 'Server Room LIU'
                },
                'SW-G2C-001-port-2': {
                    uplink: true,
                    mapping: 'LIU Port 2 → SR LIU 2 Port 14', 
                    endDevice: 'Server Room LIU'
                },
                'SW-G2C-001-port-3': {
                    uplink: false,
                    mapping: 'WiFi AP Port 1',
                    endDevice: 'Gate 2C WiFi'
                },
                'SW-G2C-001-port-4': {
                    uplink: true,
                    mapping: 'LIU Port 3 → SR LIU 2 Port 15',
                    endDevice: 'Server Room LIU'
                },
                'SW-G2C-001-port-6': {
                    uplink: true,
                    mapping: 'LIU Port 4 → SR LIU 2 Port 16',
                    endDevice: 'Server Room LIU'
                },
                'SW-G2C-001-port-8': {
                    uplink: false,
                    mapping: 'PP-1 Port 15',
                    endDevice: 'CCTV Camera'
                },
                'SW-G2C-001-port-10': {
                    uplink: false,
                    mapping: 'PP-1 Port 16',
                    endDevice: 'Road/Dera Mor'
                },
                'SW-G2C-001-port-12': {
                    uplink: false,
                    mapping: 'PP-1 Port 17',
                    endDevice: 'CCTV Camera'
                },
                'SW-G2C-001-port-14': {
                    uplink: false,
                    mapping: 'PP-1 Port 18',
                    endDevice: 'CCTV Camera'
                },
                
                // Patch Panel mappings
                'PP-G2C-001-port-6': {
                    uplink: false,
                    mapping: 'Switch Port 2',
                    endDevice: 'SNE PP Port 23'
                },
                'PP-G2C-001-port-7': {
                    uplink: false,
                    mapping: 'Switch Port 4',
                    endDevice: 'Attendance System'
                },
                'PP-G2C-001-port-13': {
                    uplink: false,
                    mapping: 'Switch Port 4',
                    endDevice: 'Attendance System'
                },
                'PP-G2C-001-port-14': {
                    uplink: false,
                    mapping: 'Switch Port 6',
                    endDevice: 'CCTV Camera'
                },
                'PP-G2C-001-port-15': {
                    uplink: false,
                    mapping: 'Switch Port 8',
                    endDevice: 'CCTV Camera'
                },
                'PP-G2C-001-port-16': {
                    uplink: false,
                    mapping: 'Switch Port 10',
                    endDevice: 'Road/Dera Mor'
                },
                'PP-G2C-001-port-17': {
                    uplink: false,
                    mapping: 'Switch Port 12',
                    endDevice: 'CCTV Camera'
                },
                'PP-G2C-001-port-18': {
                    uplink: false,
                    mapping: 'Switch Port 14',
                    endDevice: 'CCTV Camera'
                }
            }
        }
    };
}

// Switch between different rack configurations
function switchRack(rackId) {
    currentRackId = 'G2C';
    const config = rackConfigurations['G2C'];
    
    if (!config) return;
    
    // Update UI
    document.getElementById('rackTitle').textContent = config.name;
    document.getElementById('rackDetails').textContent = config.details;
    
    // Clear current rack
    clearRackSilent();
    
    // Load new rack configuration
    loadRackConfiguration(config);
}

function clearRackSilent() {
    // Clear all rack content
    const rackUnits = document.getElementById('rackUnits');
    rackUnits.innerHTML = '';
    
    // Clear cables
    const svg = document.getElementById('cablesContainer');
    svg.innerHTML = '';
    
    // Clear data
    rackData = {};
    connections = [];
    selectedPorts = [];
    
    hideConnectionForm();
    updateConnectionsList();
}

function loadRackConfiguration(config) {
    console.log('Loading rack configuration:', config);
    
    // Load devices into rackData first
    rackData = { ...config.devices };
    console.log('RackData loaded:', rackData);
    
    // Build the smart rack display
    buildRackDisplay();
    
    // Add devices to their units
    Object.entries(config.devices).forEach(([unitNumber, deviceConfig]) => {
        const unit = parseInt(unitNumber);
        console.log(`Adding device to unit ${unit}:`, deviceConfig);
        addDeviceToRackFromConfig(unit, deviceConfig);
    });
    
    // Load connections
    connections = [...config.connections];
    
    // Draw cables after a short delay to ensure devices are rendered
    setTimeout(() => {
        connections.forEach(connection => {
            // Mark ports as connected
            const portA = document.querySelector(`[data-port-id="${connection.portA}"]`);
            const portB = document.querySelector(`[data-port-id="${connection.portB}"]`);
            if (portA) portA.classList.add('connected');
            if (portB) portB.classList.add('connected');
            
            // Draw cable
            drawCable(connection);
        });
        
        updateConnectionsList();
    }, 100);
}

function addDeviceToRackFromConfig(unitNumber, deviceConfig) {
    const unit = document.querySelector(`[data-unit="${unitNumber}"]`);
    if (!unit) {
        console.error(`Unit ${unitNumber} not found`);
        return;
    }
    
    const deviceId = deviceConfig.deviceId;
    const deviceType = deviceConfig.deviceType;
    const portCount = deviceConfig.portCount;
    const deviceName = deviceConfig.name;
    
    // Create device element
    const device = document.createElement('div');
    device.className = `device-in-rack ${deviceType}`;
    device.dataset.deviceId = deviceId;
    device.dataset.deviceType = deviceType;
    device.title = `${deviceName}\n${deviceConfig.details || ''}`;
    device.innerHTML = `
        <span>${deviceName}</span>
        <div class="device-ports" id="ports-${deviceId}"></div>
    `;
    
    // Add ports with enhanced tooltips and uplink styling
    const portsContainer = device.querySelector('.device-ports');
    const config = rackConfigurations['G2C'];
    
    for (let i = 1; i <= portCount; i++) {
        const port = document.createElement('div');
        const portId = `${deviceId}-port-${i}`;
        
        port.className = 'port';
        port.dataset.portId = portId;
        port.dataset.deviceId = deviceId;
        port.dataset.portNumber = i;
        port.dataset.unitNumber = unitNumber;
        port.textContent = i;
        port.addEventListener('click', handlePortClick);
        
        // Check if this is an uplink port and add mapping info
        const portMapping = config.portMappings && config.portMappings[portId];
        if (portMapping) {
            if (portMapping.uplink) {
                port.classList.add('uplink');
            }
            
            // Create enhanced tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'port-tooltip';
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
            
            let tooltipContent = `<strong>${deviceName} Port ${i}</strong><br>`;
            
            if (portMapping.uplink) {
                tooltipContent += `🔗 <strong>UPLINK</strong><br>`;
            }
            
            tooltipContent += `📍 ${portMapping.mapping}<br>`;
            tooltipContent += `🎯 ${portMapping.endDevice}`;
            
            tooltip.innerHTML = tooltipContent;
            port.appendChild(tooltip);
            
            // Enhanced title for accessibility
            port.title = `${deviceName} Port ${i}\n${portMapping.uplink ? 'UPLINK: ' : ''}${portMapping.mapping}\nEnd Device: ${portMapping.endDevice}`;
        } else {
            // Default tooltip for unmapped ports
            const tooltip = document.createElement('div');
            tooltip.className = 'port-tooltip';
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
            tooltip.innerHTML = `<strong>${deviceName} Port ${i}</strong><br>📍 Available Port`;
            port.appendChild(tooltip);
            port.title = `${deviceName} - Port ${i}`;
        }
        
        portsContainer.appendChild(port);
    }
    
    // Add to rack unit
    unit.appendChild(device);
    unit.classList.add('occupied');
}

// Initialize rack
function initializeRack() {
    const rackUnits = document.getElementById('rackUnits');
    rackUnits.innerHTML = '';
    
    // Initialize Gate 2C configuration
    initializeRackConfigurations();
    
    // Load Gate 2C rack
    switchRack('G2C');
}

// Build rack display with collapsible empty ranges
function buildRackDisplay() {
    const rackUnits = document.getElementById('rackUnits');
    rackUnits.innerHTML = '';
    
    const occupiedUnits = Object.keys(rackData).map(u => parseInt(u)).sort((a, b) => a - b);
    console.log('Occupied units:', occupiedUnits);
    const totalUnits = 42;
    
    let currentUnit = 1;
    
    while (currentUnit <= totalUnits) {
        if (occupiedUnits.includes(currentUnit)) {
            // Create occupied unit
            console.log(`Creating occupied unit ${currentUnit}`);
            createRackUnit(currentUnit, rackUnits);
            currentUnit++;
        } else {
            // Find range of empty units
            let rangeStart = currentUnit;
            let rangeEnd = currentUnit;
            
            while (rangeEnd <= totalUnits && !occupiedUnits.includes(rangeEnd)) {
                rangeEnd++;
            }
            rangeEnd--; // Last empty unit
            
            if (rangeEnd - rangeStart >= 2) {
                // Create collapsible empty range for 3+ units
                console.log(`Creating empty range ${rangeStart}-${rangeEnd}`);
                createEmptyRange(rangeStart, rangeEnd, rackUnits);
            } else {
                // Create individual units for 1-2 empty units
                for (let i = rangeStart; i <= rangeEnd; i++) {
                    console.log(`Creating individual empty unit ${i}`);
                    createRackUnit(i, rackUnits);
                }
            }
            
            currentUnit = rangeEnd + 1;
        }
    }
}

function createRackUnit(unitNumber, container) {
    const unit = document.createElement('div');
    unit.className = 'rack-unit';
    unit.dataset.unit = unitNumber;
    
    const unitNumberDiv = document.createElement('div');
    unitNumberDiv.className = 'unit-number';
    unitNumberDiv.textContent = unitNumber;
    unit.appendChild(unitNumberDiv);
    
    // Add drop zone functionality
    unit.addEventListener('dragover', handleDragOver);
    unit.addEventListener('drop', handleDrop);
    unit.addEventListener('dragleave', handleDragLeave);
    
    container.appendChild(unit);
}

function createEmptyRange(startUnit, endUnit, container) {
    const emptyRange = document.createElement('div');
    emptyRange.className = 'empty-range';
    emptyRange.dataset.startUnit = startUnit;
    emptyRange.dataset.endUnit = endUnit;
    
    const label = document.createElement('div');
    label.className = 'empty-range-label';
    label.textContent = `Units ${startUnit}-${endUnit}: Empty (${endUnit - startUnit + 1} units)`;
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'empty-range-toggle';
    toggleBtn.textContent = '+';
    toggleBtn.onclick = (e) => {
        e.stopPropagation();
        toggleEmptyRange(emptyRange);
    };
    
    emptyRange.appendChild(label);
    emptyRange.appendChild(toggleBtn);
    
    // Make the whole range clickable
    emptyRange.onclick = () => toggleEmptyRange(emptyRange);
    
    container.appendChild(emptyRange);
}

function toggleEmptyRange(emptyRange) {
    const startUnit = parseInt(emptyRange.dataset.startUnit);
    const endUnit = parseInt(emptyRange.dataset.endUnit);
    const toggleBtn = emptyRange.querySelector('.empty-range-toggle');
    
    if (emptyRange.classList.contains('expanded')) {
        // Collapse: remove individual units
        emptyRange.classList.remove('expanded');
        toggleBtn.textContent = '+';
        
        // Remove individual units
        for (let i = startUnit; i <= endUnit; i++) {
            const unit = document.querySelector(`[data-unit="${i}"]`);
            if (unit && unit !== emptyRange) {
                unit.remove();
            }
        }
    } else {
        // Expand: add individual units
        emptyRange.classList.add('expanded');
        toggleBtn.textContent = '−';
        
        // Add individual units after this range element
        for (let i = endUnit; i >= startUnit; i--) {
            const unit = document.createElement('div');
            unit.className = 'rack-unit';
            unit.dataset.unit = i;
            
            const unitNumberDiv = document.createElement('div');
            unitNumberDiv.className = 'unit-number';
            unitNumberDiv.textContent = i;
            unit.appendChild(unitNumberDiv);
            
            // Add drop zone functionality
            unit.addEventListener('dragover', handleDragOver);
            unit.addEventListener('drop', handleDrop);
            unit.addEventListener('dragleave', handleDragLeave);
            
            // Insert after the empty range
            emptyRange.parentNode.insertBefore(unit, emptyRange.nextSibling);
        }
    }
}

// Drag and drop functionality
function setupDragAndDrop() {
    const toolItems = document.querySelectorAll('.tool-item');
    
    toolItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', '');
    e.target.classList.add('dragging');
    
    createDragPreview(e);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    removeDragPreview();
}

function createDragPreview(e) {
    const preview = document.createElement('div');
    preview.className = 'drag-preview';
    preview.textContent = e.target.querySelector('.tool-name').textContent;
    document.body.appendChild(preview);
    dragPreview = preview;
    
    document.addEventListener('mousemove', updateDragPreview);
}

function updateDragPreview(e) {
    if (dragPreview) {
        dragPreview.style.left = (e.clientX + 10) + 'px';
        dragPreview.style.top = (e.clientY + 10) + 'px';
    }
}

function removeDragPreview() {
    if (dragPreview) {
        document.body.removeChild(dragPreview);
        dragPreview = null;
        document.removeEventListener('mousemove', updateDragPreview);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drop-zone');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drop-zone');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drop-zone');
    
    const draggedElement = document.querySelector('.dragging');
    if (!draggedElement) return;
    
    const unitNumber = parseInt(e.currentTarget.dataset.unit);
    const deviceType = draggedElement.dataset.deviceType;
    const devicePorts = parseInt(draggedElement.dataset.ports) || 0;
    
    // Check if unit is already occupied
    if (e.currentTarget.classList.contains('occupied')) {
        alert('This rack unit is already occupied!');
        return;
    }
    
    // Add device to rack
    addDeviceToRack(unitNumber, deviceType, devicePorts);
}

function addDeviceToRack(unitNumber, deviceType, portCount) {
    // Check if unit exists (might be in collapsed range)
    let unit = document.querySelector(`[data-unit="${unitNumber}"]`);
    
    if (!unit) {
        // Unit might be in a collapsed range, need to expand it first
        const emptyRange = findEmptyRangeContaining(unitNumber);
        if (emptyRange) {
            toggleEmptyRange(emptyRange);
            unit = document.querySelector(`[data-unit="${unitNumber}"]`);
        }
    }
    
    if (!unit) {
        console.error(`Could not find or create unit ${unitNumber}`);
        return;
    }
    
    const deviceId = `${deviceType}-${deviceCounter++}`;
    
    // Store in rack data first
    rackData[unitNumber] = {
        deviceId,
        deviceType,
        portCount,
        ports: {},
        name: `${deviceType.toUpperCase().replace('-', ' ')} ${deviceId}`
    };
    
    // Rebuild the entire rack display to handle the new occupied unit
    buildRackDisplay();
    
    // Now add the device to the newly created unit
    unit = document.querySelector(`[data-unit="${unitNumber}"]`);
    if (unit) {
        // Create device element with basic tooltip (no mapping for new devices)
        const device = document.createElement('div');
        device.className = `device-in-rack ${deviceType}`;
        device.dataset.deviceId = deviceId;
        device.dataset.deviceType = deviceType;
        device.innerHTML = `
            <span>${rackData[unitNumber].name}</span>
            <div class="device-ports" id="ports-${deviceId}"></div>
        `;
        
        // Add ports with basic tooltips
        const portsContainer = device.querySelector('.device-ports');
        for (let i = 1; i <= portCount; i++) {
            const port = document.createElement('div');
            const portId = `${deviceId}-port-${i}`;
            
            port.className = 'port';
            port.dataset.portId = portId;
            port.dataset.deviceId = deviceId;
            port.dataset.portNumber = i;
            port.dataset.unitNumber = unitNumber;
            port.textContent = i;
            port.addEventListener('click', handlePortClick);
            
            // Basic tooltip for new devices
            const tooltip = document.createElement('div');
            tooltip.className = 'port-tooltip';
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
            tooltip.innerHTML = `<strong>${rackData[unitNumber].name} Port ${i}</strong><br>📍 Available Port`;
            port.appendChild(tooltip);
            port.title = `${rackData[unitNumber].name} - Port ${i}`;
            
            portsContainer.appendChild(port);
        }
        
        unit.appendChild(device);
        unit.classList.add('occupied');
    }
    
    console.log(`Added ${deviceType} to unit ${unitNumber}`);
}

function findEmptyRangeContaining(unitNumber) {
    const emptyRanges = document.querySelectorAll('.empty-range');
    for (const range of emptyRanges) {
        const startUnit = parseInt(range.dataset.startUnit);
        const endUnit = parseInt(range.dataset.endUnit);
        if (unitNumber >= startUnit && unitNumber <= endUnit) {
            return range;
        }
    }
    return null;
}

function handlePortClick(e) {
    e.stopPropagation();
    const port = e.target;
    const portId = port.dataset.portId;
    
    if (port.classList.contains('connected')) {
        // Port is already connected, show connection details
        showConnectionDetails(portId);
        return;
    }
    
    if (selectedPorts.includes(portId)) {
        // Deselect port
        port.classList.remove('selected');
        selectedPorts = selectedPorts.filter(p => p !== portId);
    } else {
        // Select port
        if (selectedPorts.length >= 2) {
            // Clear previous selections
            clearPortSelections();
        }
        
        port.classList.add('selected');
        selectedPorts.push(portId);
    }
    
    // Show connection form if two ports are selected
    if (selectedPorts.length === 2) {
        showConnectionForm();
    } else {
        hideConnectionForm();
    }
}

function clearPortSelections() {
    selectedPorts.forEach(portId => {
        const port = document.querySelector(`[data-port-id="${portId}"]`);
        if (port) port.classList.remove('selected');
    });
    selectedPorts = [];
}

function showConnectionForm() {
    const form = document.getElementById('connectionForm');
    form.classList.add('active');
    
    // Auto-generate cable ID
    document.getElementById('cableId').value = `CABLE-G2C-${cableCounter++}`;
}

function hideConnectionForm() {
    const form = document.getElementById('connectionForm');
    form.classList.remove('active');
}

function createConnection() {
    if (selectedPorts.length !== 2) {
        alert('Please select exactly two ports to connect.');
        return;
    }
    
    const connectionType = document.getElementById('connectionType').value;
    const cableLength = parseFloat(document.getElementById('cableLength').value);
    const cableId = document.getElementById('cableId').value || `CABLE-G2C-${cableCounter++}`;
    
    const connection = {
        id: `conn-${connections.length + 1}`,
        portA: selectedPorts[0],
        portB: selectedPorts[1],
        cableId,
        connectionType,
        cableLength,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    connections.push(connection);
    
    // Update port visuals
    selectedPorts.forEach(portId => {
        const port = document.querySelector(`[data-port-id="${portId}"]`);
        if (port) {
            port.classList.remove('selected');
            port.classList.add('connected');
        }
    });
    
    // Draw cable
    drawCable(connection);
    
    // Clear selections
    selectedPorts = [];
    hideConnectionForm();
    updateConnectionsList();
    
    console.log('Connection created:', connection);
}

function cancelConnection() {
    clearPortSelections();
    hideConnectionForm();
}

// Enhanced cable visualization functions
function drawCable(connection) {
    const svg = document.getElementById('cablesContainer');
    const portA = document.querySelector(`[data-port-id="${connection.portA}"]`);
    const portB = document.querySelector(`[data-port-id="${connection.portB}"]`);
    
    if (!portA || !portB) return;
    
    const rackFrame = document.querySelector('.rack-frame');
    const frameRect = rackFrame.getBoundingClientRect();
    const portARect = portA.getBoundingClientRect();
    const portBRect = portB.getBoundingClientRect();
    
    // Calculate relative positions within the rack frame
    const startX = portARect.left - frameRect.left + portARect.width / 2;
    const startY = portARect.top - frameRect.top + portARect.height / 2;
    const endX = portBRect.left - frameRect.left + portBRect.width / 2;
    const endY = portBRect.top - frameRect.top + portBRect.height / 2;
    
    // Enhanced cable routing with better curves
    const distance = Math.abs(endY - startY);
    const horizontalOffset = Math.abs(endX - startX);
    
    // Create more realistic cable routing
    let pathData;
    if (distance > 100) {
        // Long distance - use S-curve for better routing
        const midY = (startY + endY) / 2;
        const curve1X = startX + (horizontalOffset > 200 ? -60 : -30);
        const curve2X = endX + (horizontalOffset > 200 ? -60 : -30);
        
        pathData = `M ${startX} ${startY} 
                   C ${curve1X} ${startY} ${curve1X} ${midY} ${(startX + endX) / 2} ${midY}
                   C ${curve2X} ${midY} ${curve2X} ${endY} ${endX} ${endY}`;
    } else {
        // Short distance - simple curve
        const midX = (startX + endX) / 2;
        const curveOffset = Math.min(distance * 0.4, 40);
        
        pathData = `M ${startX} ${startY} 
                   Q ${midX - curveOffset} ${startY} ${midX} ${(startY + endY) / 2}
                   Q ${midX + curveOffset} ${endY} ${endX} ${endY}`;
    }
    
    // Create cable group
    const cableGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    cableGroup.setAttribute('class', 'cable');
    cableGroup.setAttribute('data-connection-id', connection.id);
    
    // Create cable shadow for depth
    const shadowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shadowPath.setAttribute('d', pathData);
    shadowPath.setAttribute('stroke', 'rgba(0,0,0,0.2)');
    shadowPath.setAttribute('stroke-width', '6');
    shadowPath.setAttribute('fill', 'none');
    shadowPath.setAttribute('transform', 'translate(2,2)');
    
    // Create main cable path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('class', `cable-line cable-${connection.connectionType}`);
    
    // Set cable-specific properties
    if (connection.connectionType === 'fiber') {
        path.setAttribute('stroke-dasharray', '8,4');
        path.setAttribute('stroke-linecap', 'round');
    } else if (connection.connectionType === 'power') {
        path.setAttribute('stroke-width', '5');
    }
    
    // Create enhanced cable label with background
    const labelX = (startX + endX) / 2;
    const labelY = (startY + endY) / 2 - 12;
    
    // Label background
    const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const labelText = `${connection.cableId} (${connection.connectionType.toUpperCase()})`;
    const labelWidth = labelText.length * 6 + 12;
    
    labelBg.setAttribute('x', labelX - labelWidth / 2);
    labelBg.setAttribute('y', labelY - 8);
    labelBg.setAttribute('width', labelWidth);
    labelBg.setAttribute('height', 16);
    labelBg.setAttribute('class', 'cable-label-bg');
    
    // Label text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', labelX);
    text.setAttribute('y', labelY);
    text.setAttribute('class', 'cable-label');
    text.textContent = labelText;
    
    // Connection points at each end
    const startPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    startPoint.setAttribute('cx', startX);
    startPoint.setAttribute('cy', startY);
    startPoint.setAttribute('r', '4');
    startPoint.setAttribute('class', `cable-connection-point ${connection.connectionType}`);
    
    const endPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    endPoint.setAttribute('cx', endX);
    endPoint.setAttribute('cy', endY);
    endPoint.setAttribute('r', '4');
    endPoint.setAttribute('class', `cable-connection-point ${connection.connectionType}`);
    
    // Add elements to group in correct order
    cableGroup.appendChild(shadowPath);
    cableGroup.appendChild(path);
    cableGroup.appendChild(startPoint);
    cableGroup.appendChild(endPoint);
    cableGroup.appendChild(labelBg);
    cableGroup.appendChild(text);
    
    // Add hover effects
    cableGroup.addEventListener('mouseenter', () => {
        path.style.strokeWidth = connection.connectionType === 'power' ? '7' : '6';
        path.style.opacity = '1';
        labelBg.style.fill = 'rgba(255,255,255,1)';
        text.style.fontWeight = '800';
    });
    
    cableGroup.addEventListener('mouseleave', () => {
        path.style.strokeWidth = connection.connectionType === 'power' ? '5' : '4';
        path.style.opacity = '0.9';
        labelBg.style.fill = 'rgba(255,255,255,0.95)';
        text.style.fontWeight = '700';
    });
    
    svg.appendChild(cableGroup);
}

function redrawAllCables() {
    const svg = document.getElementById('cablesContainer');
    // Clear existing cables
    svg.innerHTML = '';
    
    // Redraw all connections
    connections.forEach(connection => {
        drawCable(connection);
    });
}

function toggleCableVisibility() {
    cablesVisible = !cablesVisible;
    const svg = document.getElementById('cablesContainer');
    svg.style.display = cablesVisible ? 'block' : 'none';
    
    const button = event.target;
    button.textContent = cablesVisible ? 'Hide Cables' : 'Show Cables';
}

function updateConnectionsList() {
    const list = document.getElementById('connectionsList');
    
    // Update port usage summary
    updatePortSummary();
    
    if (connections.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #718096; font-style: italic;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔌</div>
                <div>Click on two ports to create a connection</div>
            </div>
        `;
        return;
    }
    
    list.innerHTML = connections.map(conn => {
        const portAInfo = getPortInfo(conn.portA);
        const portBInfo = getPortInfo(conn.portB);
        
        // Get connection type styling
        const typeColors = {
            ethernet: { bg: '#e6fffa', border: '#4299e1', icon: '🌐' },
            fiber: { bg: '#fffaf0', border: '#f6ad55', icon: '💡' },
            power: { bg: '#fed7d7', border: '#e53e3e', icon: '⚡' }
        };
        
        const style = typeColors[conn.connectionType] || typeColors.ethernet;
        
        return `
            <div class="connection-item" style="background: ${style.bg}; border-left: 4px solid ${style.border};">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.2rem;">${style.icon}</span>
                        <span style="font-weight: 600; color: #2d3748;">${conn.cableId}</span>
                    </div>
                    <span style="background: ${style.border}; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.7rem; font-weight: 600;">
                        ${conn.connectionType.toUpperCase()}
                    </span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <div style="flex: 1; text-align: center;">
                        <div style="font-weight: 500; color: #4a5568; font-size: 0.85rem;">${portAInfo.device}</div>
                        <div style="font-size: 0.75rem; color: #718096;">Port ${portAInfo.port}</div>
                    </div>
                    <div style="color: #a0aec0; font-size: 1.2rem;">↔</div>
                    <div style="flex: 1; text-align: center;">
                        <div style="font-weight: 500; color: #4a5568; font-size: 0.85rem;">${portBInfo.device}</div>
                        <div style="font-size: 0.75rem; color: #718096;">Port ${portBInfo.port}</div>
                    </div>
                </div>
                
                ${conn.description ? `
                    <div style="font-size: 0.75rem; color: #718096; margin-bottom: 0.5rem; font-style: italic;">
                        ${conn.description}
                    </div>
                ` : ''}
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 0.75rem; color: #718096;">
                        📏 ${conn.cableLength}m • 
                        <span style="color: ${conn.status === 'active' ? '#48bb78' : '#e53e3e'};">
                            ● ${conn.status}
                        </span>
                    </div>
                    <div class="connection-actions">
                        <button class="btn btn-small btn-secondary" onclick="editConnection('${conn.id}')" style="margin-right: 0.25rem;">
                            📝 Edit
                        </button>
                        <button class="btn btn-small btn-danger" onclick="deleteConnection('${conn.id}')">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updatePortSummary() {
    const summaryElement = document.getElementById('portSummary');
    if (!summaryElement) return;
    
    // Count ports by type and status
    let totalPorts = 0;
    let connectedPorts = 0;
    let uplinkPorts = 0;
    let connectedUplinks = 0;
    let availablePorts = 0;
    
    // Count all ports in all devices
    Object.values(rackData).forEach(device => {
        totalPorts += device.portCount;
    });
    
    // Count connected ports
    const connectedPortIds = new Set();
    connections.forEach(conn => {
        connectedPortIds.add(conn.portA);
        connectedPortIds.add(conn.portB);
    });
    connectedPorts = connectedPortIds.size;
    
    // Count uplink ports
    const config = rackConfigurations['G2C'];
    if (config && config.portMappings) {
        Object.entries(config.portMappings).forEach(([portId, mapping]) => {
            if (mapping.uplink) {
                uplinkPorts++;
                if (connectedPortIds.has(portId)) {
                    connectedUplinks++;
                }
            }
        });
    }
    
    availablePorts = totalPorts - connectedPorts;
    
    const utilizationPercent = totalPorts > 0 ? Math.round((connectedPorts / totalPorts) * 100) : 0;
    
    summaryElement.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
            <div><strong>Total Ports:</strong> ${totalPorts}</div>
            <div><strong>Utilization:</strong> ${utilizationPercent}%</div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
            <div style="color: #48bb78;"><strong>🟢 Connected:</strong> ${connectedPorts}</div>
            <div style="color: #718096;"><strong>⚪ Available:</strong> ${availablePorts}</div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
            <div style="color: #9f7aea;"><strong>🟣 Uplinks:</strong> ${uplinkPorts}</div>
            <div style="color: #667eea;"><strong>🔗 Active Uplinks:</strong> ${connectedUplinks}</div>
        </div>
    `;
}

function getPortInfo(portId) {
    const [deviceId, , portNumber] = portId.split('-');
    return {
        device: deviceId.toUpperCase(),
        port: portNumber
    };
}

function deleteConnection(connectionId) {
    const connection = connections.find(c => c.id === connectionId);
    if (!connection) return;
    
    // Remove connected status from ports
    [connection.portA, connection.portB].forEach(portId => {
        const port = document.querySelector(`[data-port-id="${portId}"]`);
        if (port) {
            port.classList.remove('connected');
        }
    });
    
    // Remove cable visual
    const cableElement = document.querySelector(`[data-connection-id="${connectionId}"]`);
    if (cableElement) {
        cableElement.remove();
    }
    
    // Remove connection
    connections = connections.filter(c => c.id !== connectionId);
    updateConnectionsList();
    
    console.log('Connection deleted:', connectionId);
}

function showConnectionDetails(portId) {
    const connection = connections.find(c => c.portA === portId || c.portB === portId);
    if (connection) {
        const portAInfo = getPortInfo(connection.portA);
        const portBInfo = getPortInfo(connection.portB);
        const config = rackConfigurations['G2C'];
        
        const typeIcons = {
            ethernet: '🌐',
            fiber: '💡',
            power: '⚡'
        };
        
        let details = `Connection Details ${typeIcons[connection.connectionType] || '🔌'}\n\n`;
        details += `Cable ID: ${connection.cableId}\n`;
        details += `Type: ${connection.connectionType.toUpperCase()}\n`;
        details += `Length: ${connection.cableLength}m\n`;
        details += `Status: ${connection.status.toUpperCase()}\n\n`;
        
        details += `From: ${portAInfo.device} Port ${portAInfo.port}\n`;
        details += `To: ${portBInfo.device} Port ${portBInfo.port}\n\n`;
        
        // Add mapping information if available
        const portAMapping = config.portMappings && config.portMappings[connection.portA];
        const portBMapping = config.portMappings && config.portMappings[connection.portB];
        
        if (portAMapping || portBMapping) {
            details += `📍 Signal Path:\n`;
            
            if (portAMapping) {
                details += `${portAMapping.uplink ? '🔗 ' : ''}${connection.portA} → ${portAMapping.mapping} → ${portAMapping.endDevice}\n`;
            }
            
            if (portBMapping) {
                details += `${portBMapping.uplink ? '🔗 ' : ''}${connection.portB} → ${portBMapping.mapping} → ${portBMapping.endDevice}\n`;
            }
            details += '\n';
        }
        
        if (connection.description) {
            details += `Description: ${connection.description}`;
        }
        
        alert(details.trim());
    }
}

function editConnection(connectionId) {
    const connection = connections.find(c => c.id === connectionId);
    if (!connection) return;
    
    const newLength = prompt(`Edit cable length for ${connection.cableId}:`, connection.cableLength);
    if (newLength && !isNaN(newLength)) {
        connection.cableLength = parseFloat(newLength);
        updateConnectionsList();
        redrawAllCables();
        console.log(`Updated cable length for ${connection.cableId} to ${newLength}m`);
    }
}

function clearRack() {
    if (!confirm('Are you sure you want to clear the entire rack? This will remove all devices and connections.')) {
        return;
    }
    
    // Clear rack units
    document.querySelectorAll('.rack-unit').forEach(unit => {
        unit.classList.remove('occupied');
        const device = unit.querySelector('.device-in-rack');
        if (device) {
            unit.removeChild(device);
        }
    });
    
    // Clear cables
    const svg = document.getElementById('cablesContainer');
    svg.innerHTML = '';
    
    // Clear data
    rackData = {};
    connections = [];
    selectedPorts = [];
    deviceCounter = 1;
    cableCounter = 1;
    
    hideConnectionForm();
    updateConnectionsList();
    
    console.log('Rack cleared');
}

function toggleToolbox() {
    const toolbox = document.getElementById('toolbox');
    const toggleIcon = document.getElementById('toolboxToggleIcon');
    
    toolbox.classList.toggle('collapsed');
    
    if (toolbox.classList.contains('collapsed')) {
        toggleIcon.textContent = '▶';
    } else {
        toggleIcon.textContent = '◀';
    }
}

function toggleLegend() {
    const legend = document.getElementById('portLegend');
    const toggleBtn = document.getElementById('legendToggle');
    
    legend.classList.toggle('hidden');
    
    if (legend.classList.contains('hidden')) {
        toggleBtn.textContent = '📋 Show Legend';
    } else {
        toggleBtn.textContent = '📋 Hide Legend';
    }
}

function saveConfiguration() {
    const config = {
        rackId: 'G2C',
        rackName: 'Gate 2C Network Rack',
        devices: rackData,
        connections: connections,
        savedAt: new Date().toISOString()
    };
    
    console.log('Gate 2C Configuration saved:', config);
    alert('Gate 2C rack configuration saved successfully!');
    
    // Download config
    downloadConfig(config);
}

function downloadConfig(config) {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `gate-2c-rack-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeRack();
    setupDragAndDrop();
    
    // Update cable positions when window resizes
    window.addEventListener('resize', () => {
        setTimeout(redrawAllCables, 100);
    });
    
    console.log('Gate 2C Rack Manager initialized');
});
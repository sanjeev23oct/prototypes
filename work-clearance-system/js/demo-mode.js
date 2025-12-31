/**
 * Demo Mode - Auto-play form filling for presentations
 * Pure JavaScript, no dependencies
 */

const DemoMode = {
    state: {
        isPlaying: false,
        isPaused: false,
        currentStep: 0,
        currentAction: 0,
        timeouts: [],
        userOverride: false,
        demoInteracting: false
    },

    actions: [
        // Step 1 actions
        { type: 'typeText', selector: '[name="title"]', text: 'Fiber Cable Installation - Main Hall Area', delay: 50 },
        { type: 'wait', duration: 300 },
        { type: 'selectOption', selector: '[name="department"]', value: 'it', delay: 200 },
        { type: 'wait', duration: 300 },
        { type: 'selectOption', selector: '[name="workType"]', value: 'telecom', delay: 200 },
        { type: 'wait', duration: 300 },
        { type: 'selectOption', selector: '[name="location"]', value: 'main-hall', delay: 200 },
        { type: 'wait', duration: 300 },
        { type: 'setDateTime', selector: '[name="startDate"]', daysFromNow: 2, delay: 200 },
        { type: 'wait', duration: 300 },
        { type: 'setDateTime', selector: '[name="endDate"]', daysFromNow: 4, delay: 200 },
        { type: 'wait', duration: 300 },
        { type: 'typeText', selector: '[name="description"]', text: 'Installation of new fiber optic cables to improve network connectivity in the main satsang hall. This work involves trenching along the pathway.', delay: 30 },
        { type: 'wait', duration: 500 },
        { type: 'typeText', selector: '[name="emergencyContact"]', text: '+91-9876543216', delay: 80 },
        { type: 'wait', duration: 300 },
        { type: 'typeText', selector: '[name="duration"]', text: '16', delay: 100 },
        { type: 'wait', duration: 500 },
        { type: 'click', selector: '#nextBtn', delay: 300 },
        { type: 'wait', duration: 800 },
        
        // Step 2 actions
        { type: 'checkBox', selector: '[name="infrastructure"][value="fiber"]', delay: 200 },
        { type: 'wait', duration: 300 },
        { type: 'checkBox', selector: '[name="infrastructure"][value="power"]', delay: 200 },
        { type: 'wait', duration: 300 },
        { type: 'checkBox', selector: '[name="infrastructure"][value="telecom"]', delay: 200 },
        { type: 'wait', duration: 500 },
        { type: 'checkBox', selector: '[name="notifyDepartments"][value="electrical"]', delay: 200 },
        { type: 'wait', duration: 300 },
        { type: 'checkBox', selector: '[name="notifyDepartments"][value="security"]', delay: 200 },
        { type: 'wait', duration: 300 },
        { type: 'checkBox', selector: '[name="notifyDepartments"][value="maintenance"]', delay: 200 },
        { type: 'wait', duration: 300 },
        { type: 'checkBox', selector: '[name="notifyDepartments"][value="construction"]', delay: 200 },
        { type: 'wait', duration: 500 },
        { type: 'typeText', selector: '[name="safetyMeasures"]', text: 'Use underground utility detection equipment. Install safety barriers. Coordinate with electrical department.', delay: 40 },
        { type: 'wait', duration: 1000 },
        { type: 'toast', message: 'Demo complete! Form ready to submit.', type: 'success' }
    ],

    init() {
        this.createDemoControls();
        this.setupEventListeners();
    },

    createDemoControls() {
        const controls = document.createElement('div');
        controls.id = 'demoControls';
        controls.className = 'fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 border-2 border-purple-500';
        controls.innerHTML = `
            <div class="flex flex-col space-y-2">
                <div class="flex items-center space-x-2">
                    <span class="text-sm font-semibold text-purple-700">🎬 Demo Mode</span>
                </div>
                <div class="flex items-center space-x-2">
                    <button id="demoPlayBtn" class="btn btn-sm bg-green-500 hover:bg-green-600 text-white">
                        <i class="fas fa-edit"></i> Submit Request Demo
                    </button>
                    <button id="demoPauseBtn" class="btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white hidden">
                        <i class="fas fa-pause"></i> Pause
                    </button>
                    <button id="demoStopBtn" class="btn btn-sm bg-red-500 hover:bg-red-600 text-white hidden">
                        <i class="fas fa-stop"></i> Stop
                    </button>
                    <div id="demoProgress" class="text-xs text-gray-600 hidden">
                        <span id="demoProgressText">0/0</span>
                    </div>
                </div>
                <button id="demoApprovalBtn" class="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white w-full">
                    <i class="fas fa-check-double"></i> Approval Workflow Demo
                </button>
            </div>
            <div id="demoDescription" class="text-xs text-gray-600 mt-2 hidden max-w-md bg-blue-50 p-2 rounded">
                <strong>Approval Demo:</strong> IT dept raises request → Selects Electrical & Security for clearance → Both depts login and approve → Request becomes APPROVED
            </div>
        `;
        document.body.appendChild(controls);
    },

    setupEventListeners() {
        document.getElementById('demoPlayBtn').addEventListener('click', () => this.play());
        document.getElementById('demoPauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('demoStopBtn').addEventListener('click', () => this.stop());
        document.getElementById('demoApprovalBtn').addEventListener('click', () => this.playApprovalDemo());

        // Detect user interaction to pause demo (but not when demo is typing)
        document.addEventListener('focus', (e) => {
            if (this.state.isPlaying && !this.state.isPaused) {
                if (e.target.matches('input, textarea, select')) {
                    // Check if this is a user-initiated focus (not from demo)
                    // We'll use a flag to track if demo is currently interacting
                    if (!this.state.demoInteracting) {
                        this.state.userOverride = true;
                        this.pause();
                        Components.toast.info('Demo paused - you can edit manually. Click Play to resume.');
                    }
                }
            }
        }, true);
    },

    play() {
        console.log('Demo play() called, isPaused:', this.state.isPaused);
        
        if (this.state.isPaused) {
            // Resume from pause
            console.log('Resuming from pause');
            this.state.isPaused = false;
            this.state.userOverride = false;
            this.updateControls();
            this.executeNextAction();
        } else {
            // Start from beginning
            console.log('Starting demo from beginning');
            this.state.isPlaying = true;
            this.state.isPaused = false;
            this.state.currentAction = 0;
            this.state.userOverride = false;
            this.updateControls();
            
            // Open modal if not already open
            const modal = document.getElementById('newRequestModal');
            console.log('Modal element:', modal);
            console.log('Modal has hidden class:', modal ? modal.classList.contains('hidden') : 'no modal');
            
            if (modal && modal.classList.contains('hidden')) {
                console.log('Opening modal...');
                WorkClearanceSystem.showNewRequestModal();
                setTimeout(() => {
                    console.log('Starting execution after modal open');
                    this.executeNextAction();
                }, 1000);
            } else {
                console.log('Modal already open, starting execution');
                setTimeout(() => this.executeNextAction(), 500);
            }
        }
    },

    pause() {
        this.state.isPaused = true;
        this.clearTimeouts();
        this.updateControls();
    },

    stop() {
        this.state.isPlaying = false;
        this.state.isPaused = false;
        this.state.currentAction = 0;
        this.state.userOverride = false;
        this.clearTimeouts();
        this.updateControls();
        
        // Close modal and reset form
        Components.modal.hide('newRequestModal');
        Components.toast.info('Demo stopped');
    },

    clearTimeouts() {
        this.state.timeouts.forEach(timeout => clearTimeout(timeout));
        this.state.timeouts = [];
    },

    updateControls() {
        const playBtn = document.getElementById('demoPlayBtn');
        const pauseBtn = document.getElementById('demoPauseBtn');
        const stopBtn = document.getElementById('demoStopBtn');
        const progress = document.getElementById('demoProgress');
        const progressText = document.getElementById('demoProgressText');

        if (this.state.isPlaying && !this.state.isPaused) {
            playBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
            stopBtn.classList.remove('hidden');
            progress.classList.remove('hidden');
            progressText.textContent = `${this.state.currentAction}/${this.actions.length}`;
        } else if (this.state.isPaused) {
            playBtn.classList.remove('hidden');
            playBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            pauseBtn.classList.add('hidden');
            stopBtn.classList.remove('hidden');
            progress.classList.remove('hidden');
        } else {
            playBtn.classList.remove('hidden');
            playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
            pauseBtn.classList.add('hidden');
            stopBtn.classList.add('hidden');
            progress.classList.add('hidden');
        }
    },

    executeNextAction() {
        console.log('executeNextAction called, isPlaying:', this.state.isPlaying, 'isPaused:', this.state.isPaused, 'currentAction:', this.state.currentAction);
        
        if (!this.state.isPlaying || this.state.isPaused) {
            console.log('Stopping execution - not playing or paused');
            return;
        }
        
        if (this.state.currentAction >= this.actions.length) {
            console.log('All actions completed');
            this.stop();
            return;
        }

        const action = this.actions[this.state.currentAction];
        console.log('Executing action:', action.type, action);
        this.state.currentAction++;
        this.updateControls();

        switch (action.type) {
            case 'typeText':
                this.typeText(action.selector, action.text, action.delay);
                break;
            case 'selectOption':
                this.selectOption(action.selector, action.value, action.delay);
                break;
            case 'checkBox':
                this.checkBox(action.selector, action.delay);
                break;
            case 'click':
                this.clickElement(action.selector, action.delay);
                break;
            case 'setDateTime':
                this.setDateTime(action.selector, action.daysFromNow, action.delay);
                break;
            case 'wait':
                this.wait(action.duration);
                break;
            case 'toast':
                Components.toast[action.type || 'info'](action.message);
                this.executeNextAction();
                break;
        }
    },

    typeText(selector, text, charDelay) {
        const element = document.querySelector(selector);
        console.log('typeText - selector:', selector, 'element found:', !!element, 'isPlaying:', this.state.isPlaying, 'isPaused:', this.state.isPaused);
        
        if (!element) {
            console.log('Element not found, skipping to next action');
            this.executeNextAction();
            return;
        }

        element.value = '';
        
        // Set flag to prevent focus event from pausing
        this.state.demoInteracting = true;
        element.focus();
        
        let index = 0;
        
        // Capture state at start
        const self = this;

        const typeChar = () => {
            console.log('typeChar - index:', index, 'isPlaying:', self.state.isPlaying, 'isPaused:', self.state.isPaused);
            
            if (!self.state.isPlaying || self.state.isPaused) {
                console.log('Typing stopped - not playing or paused');
                self.state.demoInteracting = false;
                return;
            }
            if (index < text.length) {
                element.value += text[index];
                element.dispatchEvent(new Event('input', { bubbles: true }));
                index++;
                const timeout = setTimeout(typeChar, charDelay);
                self.state.timeouts.push(timeout);
            } else {
                console.log('Typing complete for:', selector);
                element.blur();
                self.state.demoInteracting = false;
                self.executeNextAction();
            }
        };

        typeChar();
    },

    selectOption(selector, value, delay) {
        const element = document.querySelector(selector);
        if (!element) {
            this.executeNextAction();
            return;
        }

        this.state.demoInteracting = true;
        element.focus();
        const timeout = setTimeout(() => {
            element.value = value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.blur();
            this.state.demoInteracting = false;
            this.executeNextAction();
        }, delay);
        this.state.timeouts.push(timeout);
    },

    checkBox(selector, delay) {
        const element = document.querySelector(selector);
        if (!element) {
            this.executeNextAction();
            return;
        }

        const timeout = setTimeout(() => {
            element.checked = true;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            this.executeNextAction();
        }, delay);
        this.state.timeouts.push(timeout);
    },

    clickElement(selector, delay) {
        const element = document.querySelector(selector);
        if (!element) {
            this.executeNextAction();
            return;
        }

        const timeout = setTimeout(() => {
            element.click();
            this.executeNextAction();
        }, delay);
        this.state.timeouts.push(timeout);
    },

    setDateTime(selector, daysFromNow, delay) {
        const element = document.querySelector(selector);
        if (!element) {
            this.executeNextAction();
            return;
        }

        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        const dateString = date.toISOString().slice(0, 16);

        this.state.demoInteracting = true;
        element.focus();
        const timeout = setTimeout(() => {
            element.value = dateString;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.blur();
            this.state.demoInteracting = false;
            this.executeNextAction();
        }, delay);
        this.state.timeouts.push(timeout);
    },

    wait(duration) {
        const timeout = setTimeout(() => {
            this.executeNextAction();
        }, duration);
        this.state.timeouts.push(timeout);
    },

    /**
     * Play approval workflow demo
     */
    async playApprovalDemo() {
        // Show description
        const desc = document.getElementById('demoDescription');
        desc.classList.remove('hidden');
        
        Components.toast.info('🎬 Starting Approval Workflow Demo...', 5000);
        
        await Utils.async.delay(4000);
        
        // Step 1: Impersonate IT user
        Components.toast.info('👩‍💻 Step 1: IT Department user logs in', 5000);
        await Utils.async.delay(3000);
        WorkClearanceSystem.impersonateUser('it_head');
        await Utils.async.delay(3000);
        
        // Step 2: Open form
        Components.toast.info('📝 Step 2: Opening new request form...', 5000);
        await Utils.async.delay(2000);
        WorkClearanceSystem.showNewRequestModal();
        await Utils.async.delay(4000);
        
        // Step 3: Fill form - Step 1
        Components.toast.info('✍️ Step 3: Filling request details...', 5000);
        await Utils.async.delay(2000);
        
        document.querySelector('[name="title"]').value = 'Network Cable Installation';
        await Utils.async.delay(800);
        document.querySelector('[name="department"]').value = 'it';
        await Utils.async.delay(800);
        document.querySelector('[name="workType"]').value = 'telecom';
        await Utils.async.delay(800);
        document.querySelector('[name="location"]').value = 'admin-block';
        await Utils.async.delay(800);
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1);
        document.querySelector('[name="startDate"]').value = startDate.toISOString().slice(0, 16);
        await Utils.async.delay(800);
        
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 2);
        document.querySelector('[name="endDate"]').value = endDate.toISOString().slice(0, 16);
        await Utils.async.delay(800);
        
        document.querySelector('[name="description"]').value = 'Installing new network cables in admin block for improved connectivity.';
        await Utils.async.delay(800);
        document.querySelector('[name="emergencyContact"]').value = '+91-9876543216';
        await Utils.async.delay(800);
        document.querySelector('[name="duration"]').value = '8';
        await Utils.async.delay(2500);
        
        // Step 4: Go to next step
        Components.toast.info('➡️ Step 4: Moving to coordination step...', 5000);
        await Utils.async.delay(2000);
        document.getElementById('nextBtn').click();
        await Utils.async.delay(3500);
        
        // Step 5: Select departments
        Components.toast.info('🏢 Step 5: Selecting Electrical & Security for clearance...', 5000);
        await Utils.async.delay(2000);
        
        document.querySelector('[name="infrastructure"][value="fiber"]').checked = true;
        await Utils.async.delay(1000);
        document.querySelector('[name="infrastructure"][value="power"]').checked = true;
        await Utils.async.delay(2000);
        
        document.querySelector('[name="notifyDepartments"][value="electrical"]').checked = true;
        await Utils.async.delay(1500);
        document.querySelector('[name="notifyDepartments"][value="security"]').checked = true;
        await Utils.async.delay(2000);
        
        document.querySelector('[name="safetyMeasures"]').value = 'Follow safety protocols. Coordinate with departments.';
        await Utils.async.delay(3000);
        
        // Step 6: Submit
        Components.toast.info('📤 Step 6: Submitting request...', 5000);
        await Utils.async.delay(2000);
        document.getElementById('submitBtn').click();
        await Utils.async.delay(5000);
        
        // Step 7: Impersonate Electrical user
        Components.toast.info('👨‍🔧 Step 7: Electrical Dept user logs in to review', 5000);
        await Utils.async.delay(3000);
        WorkClearanceSystem.impersonateUser('electrical_head');
        await Utils.async.delay(2000);
        
        // Clear filters to see all requests
        WorkClearanceSystem.state.currentFilters = { status: '', department: '', priority: '', search: '' };
        WorkClearanceSystem.applyFilters();
        WorkClearanceSystem.renderWorkRequests();
        await Utils.async.delay(1500);
        
        // Step 8: Find and view the request
        const requests = WorkClearanceSystem.state.workRequests;
        const newRequest = requests.find(r => r.title === 'Network Cable Installation');
        if (newRequest) {
            Components.toast.info('👁️ Step 8: Opening request details to review...', 5000);
            await Utils.async.delay(2500);
            WorkClearanceSystem.viewRequest(newRequest.id);
            await Utils.async.delay(6000);
            
            Components.toast.info('✅ Step 9: Electrical approving clearance...', 5000);
            await Utils.async.delay(2500);
            Components.modal.hide('requestDetailsModal');
            await Utils.async.delay(1000);
            await WorkClearanceSystem.approveRequest(newRequest.id);
            await Utils.async.delay(4000);
        }
        
        // Step 10: Impersonate Security user
        Components.toast.info('👮‍♂️ Step 10: Security Dept user logs in to review', 5000);
        await Utils.async.delay(3000);
        WorkClearanceSystem.impersonateUser('security_head');
        await Utils.async.delay(2000);
        
        // Clear filters to see all requests
        WorkClearanceSystem.state.currentFilters = { status: '', department: '', priority: '', search: '' };
        WorkClearanceSystem.applyFilters();
        WorkClearanceSystem.renderWorkRequests();
        await Utils.async.delay(1500);
        
        // Step 11: Approve as security
        if (newRequest) {
            Components.toast.info('👁️ Step 11: Opening request details to review...', 5000);
            await Utils.async.delay(2500);
            WorkClearanceSystem.viewRequest(newRequest.id);
            await Utils.async.delay(6000);
            
            Components.toast.info('✅ Step 12: Security approving clearance...', 5000);
            await Utils.async.delay(2500);
            Components.modal.hide('requestDetailsModal');
            await Utils.async.delay(1000);
            await WorkClearanceSystem.approveRequest(newRequest.id);
            await Utils.async.delay(4000);
        }
        
        // Final message
        Components.toast.success('🎉 Demo Complete! Request is now APPROVED by all departments.', 8000);
        
        setTimeout(() => {
            desc.classList.add('hidden');
        }, 8000);
    }
};

// Initialize demo mode when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    DemoMode.init();
});

// Export for global access
window.DemoMode = DemoMode;

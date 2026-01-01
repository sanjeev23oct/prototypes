/**
 * Demo Engine - Pure JavaScript Auto-Play System
 * No external dependencies required
 */

const DemoEngine = {
    state: {
        isPlaying: false,
        isPaused: false,
        currentAction: 0,
        timeouts: [],
        userOverride: false,
        demoInteracting: false
    },

    actions: [
        // Step 1: Customer Information
        { type: 'toast', message: '📋 Step 1: Filling customer information...', duration: 3000 },
        { type: 'wait', duration: 2000 },
        { type: 'typeText', selector: '#firstName', text: 'Sarah', delay: 80 },
        { type: 'wait', duration: 400 },
        { type: 'typeText', selector: '#lastName', text: 'Johnson', delay: 80 },
        { type: 'wait', duration: 400 },
        { type: 'typeText', selector: '#email', text: 'sarah.j@example.com', delay: 60 },
        { type: 'wait', duration: 400 },
        { type: 'typeText', selector: '#phone', text: '+1-555-0123', delay: 100 },
        { type: 'wait', duration: 800 },
        { type: 'click', selector: '.form-section.active .btn-primary', delay: 300 },
        { type: 'wait', duration: 1000 },
        
        // Step 2: Shipping Address
        { type: 'toast', message: '🏠 Step 2: Adding delivery address...', duration: 3000 },
        { type: 'wait', duration: 1500 },
        { type: 'typeText', selector: '#address', text: '123 Main Street, Apt 4B', delay: 70 },
        { type: 'wait', duration: 400 },
        { type: 'typeText', selector: '#city', text: 'San Francisco', delay: 70 },
        { type: 'wait', duration: 400 },
        { type: 'selectOption', selector: '#state', value: 'CA', delay: 200 },
        { type: 'wait', duration: 400 },
        { type: 'typeText', selector: '#zipCode', text: '94102', delay: 100 },
        { type: 'wait', duration: 400 },
        { type: 'selectOption', selector: '#country', value: 'USA', delay: 200 },
        { type: 'wait', duration: 800 },
        { type: 'click', selector: '.form-section.active .btn-primary', delay: 300 },
        { type: 'wait', duration: 1000 },
        
        // Step 3: Payment Information
        { type: 'toast', message: '💳 Step 3: Entering payment details...', duration: 3000 },
        { type: 'wait', duration: 1500 },
        { type: 'click', selector: '#paymentCard', delay: 300 },
        { type: 'wait', duration: 500 },
        { type: 'typeText', selector: '#cardNumber', text: '4532 1234 5678 9010', delay: 90 },
        { type: 'wait', duration: 400 },
        { type: 'typeText', selector: '#cardName', text: 'Sarah Johnson', delay: 80 },
        { type: 'wait', duration: 400 },
        { type: 'typeText', selector: '#expiry', text: '12/25', delay: 100 },
        { type: 'wait', duration: 400 },
        { type: 'typeText', selector: '#cvv', text: '123', delay: 120 },
        { type: 'wait', duration: 800 },
        { type: 'click', selector: '.form-section.active .btn-primary', delay: 300 },
        { type: 'wait', duration: 1000 },
        
        // Step 4: Review and Submit
        { type: 'toast', message: '✅ Step 4: Reviewing order...', duration: 3000 },
        { type: 'wait', duration: 2000 },
        { type: 'checkBox', selector: '#agreeTerms', delay: 300 },
        { type: 'wait', duration: 1000 },
        { type: 'toast', message: '🎉 Placing order...', type: 'success', duration: 3000 },
        { type: 'wait', duration: 500 },
        { type: 'click', selector: '#placeOrderBtn', delay: 500 },
        { type: 'wait', duration: 2000 },
        { type: 'toast', message: '✨ Order completed successfully!', type: 'success', duration: 4000 }
    ],

    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.getElementById('playBtn').addEventListener('click', () => this.play());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('stopBtn').addEventListener('click', () => this.stop());

        // Detect user interaction to pause demo
        document.addEventListener('focus', (e) => {
            if (this.state.isPlaying && !this.state.isPaused) {
                if (e.target.matches('input, textarea, select')) {
                    if (!this.state.demoInteracting) {
                        this.state.userOverride = true;
                        this.pause();
                        this.showToast('Demo paused - you can edit manually. Click Resume to continue.', 'info');
                    }
                }
            }
        }, true);
    },

    play() {
        if (this.state.isPaused) {
            // Resume from pause
            this.state.isPaused = false;
            this.state.userOverride = false;
            this.updateControls();
            this.executeNextAction();
        } else {
            // Start from beginning
            this.state.isPlaying = true;
            this.state.isPaused = false;
            this.state.currentAction = 0;
            this.state.userOverride = false;
            this.updateControls();
            this.executeNextAction();
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
        
        // Reset form
        document.getElementById('checkoutForm').reset();
        this.showToast('Demo stopped and form reset', 'info');
    },

    clearTimeouts() {
        this.state.timeouts.forEach(timeout => clearTimeout(timeout));
        this.state.timeouts = [];
    },

    updateControls() {
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const stopBtn = document.getElementById('stopBtn');
        const progress = document.getElementById('demoProgress');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        if (this.state.isPlaying && !this.state.isPaused) {
            playBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
            stopBtn.classList.remove('hidden');
            progress.classList.remove('hidden');
            
            const percentage = (this.state.currentAction / this.actions.length) * 100;
            progressFill.style.width = `${percentage}%`;
            progressText.textContent = `${this.state.currentAction}/${this.actions.length}`;
        } else if (this.state.isPaused) {
            playBtn.classList.remove('hidden');
            playBtn.querySelector('.btn-text').textContent = 'Resume';
            playBtn.querySelector('.btn-icon').textContent = '▶';
            pauseBtn.classList.add('hidden');
            stopBtn.classList.remove('hidden');
            progress.classList.remove('hidden');
        } else {
            playBtn.classList.remove('hidden');
            playBtn.querySelector('.btn-text').textContent = 'Play Demo';
            playBtn.querySelector('.btn-icon').textContent = '▶';
            pauseBtn.classList.add('hidden');
            stopBtn.classList.add('hidden');
            progress.classList.add('hidden');
        }
    },

    executeNextAction() {
        if (!this.state.isPlaying || this.state.isPaused) return;
        
        if (this.state.currentAction >= this.actions.length) {
            this.stop();
            return;
        }

        const action = this.actions[this.state.currentAction];
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
            case 'wait':
                this.wait(action.duration);
                break;
            case 'toast':
                this.showToast(action.message, action.type || 'info', action.duration);
                this.executeNextAction();
                break;
        }
    },

    typeText(selector, text, charDelay) {
        const element = document.querySelector(selector);
        if (!element) {
            this.executeNextAction();
            return;
        }

        element.value = '';
        this.state.demoInteracting = true;
        element.focus();
        
        let index = 0;
        const self = this;

        const typeChar = () => {
            if (!self.state.isPlaying || self.state.isPaused) {
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

    wait(duration) {
        const timeout = setTimeout(() => {
            this.executeNextAction();
        }, duration);
        this.state.timeouts.push(timeout);
    },

    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
        toast.innerHTML = `
            <span style="font-size: 1.2rem;">${icon}</span>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    DemoEngine.init();
});

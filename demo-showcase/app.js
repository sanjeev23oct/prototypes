/**
 * Application Logic - Form Navigation and Submission
 */

let currentStep = 1;
const totalSteps = 4;

function nextStep() {
    if (currentStep < totalSteps) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep++;
        document.getElementById(`step${currentStep}`).classList.add('active');
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep--;
        document.getElementById(`step${currentStep}`).classList.add('active');
    }
}

function submitOrder(event) {
    console.log('submitOrder called', event);
    
    // Prevent default form submission if called from form
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    
    const agreeTerms = document.getElementById('agreeTerms');
    console.log('agreeTerms element:', agreeTerms);
    console.log('agreeTerms checked:', agreeTerms ? agreeTerms.checked : 'element not found');
    
    if (!agreeTerms || !agreeTerms.checked) {
        if (typeof DemoEngine !== 'undefined' && DemoEngine.showToast) {
            DemoEngine.showToast('Please agree to the terms and conditions', 'error');
        } else {
            alert('Please agree to the terms and conditions');
        }
        return false;
    }
    
    // Show success modal
    const modal = document.getElementById('successModal');
    console.log('Success modal:', modal);
    if (modal) {
        modal.classList.remove('hidden');
        console.log('Modal shown');
    }
    
    // Auto-close modal and reset after delay (for demo mode)
    setTimeout(() => {
        closeModal();
        resetForm();
    }, 3000);
    
    return false;
}

function resetForm() {
    document.getElementById('checkoutForm').reset();
    currentStep = 1;
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('step1').classList.add('active');
}

function closeModal() {
    document.getElementById('successModal').classList.add('hidden');
}

// Close modal on background click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
    }
});

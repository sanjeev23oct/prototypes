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

function submitOrder() {
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!agreeTerms) {
        DemoEngine.showToast('Please agree to the terms and conditions', 'error');
        return;
    }
    
    // Show success modal
    document.getElementById('successModal').classList.remove('hidden');
    
    // Reset form after a delay
    setTimeout(() => {
        document.getElementById('checkoutForm').reset();
        currentStep = 1;
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById('step1').classList.add('active');
    }, 2000);
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

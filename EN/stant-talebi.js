function validateForm() {
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const recaptcha = document.getElementById('recaptcha').checked;

    // Email validation
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        alert('Lütfen geçerli bir e-posta adresi giriniz');
        return false;
    }

    // Phone validation
    if (!/^\d{10}$/.test(phone)) {
        alert('Lütfen geçerli bir telefon numarası giriniz (10 haneli)');
        return false;
    }

    // Recaptcha check
    if (!recaptcha) {
        alert('Lütfen "Ben robot değilim" kutusunu işaretleyin');
        return false;
    }

    // If all validations pass
    alert('Form başarıyla gönderildi!');
    document.getElementById('standForm').reset();
    return false; // Prevent form submission for this example
}
const form = document.querySelector('form');
const alertPopup = document.querySelector('.alert');

const msg = {
    fail: '<i></i> Passport is incorrect. Please try again.',
    success: '<i></i> Authorization success! You will be redirected to home.'
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch('/preferences/authorize/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pw: form.querySelector('input[type=password]').value })
    }).then(async(resp) => {
        const pwIsCorrect = await resp.json();
        
        if (pwIsCorrect) {
            alertPopup.innerHTML = msg.success;
            alertPopup.classList.add('success');
            alertPopup.classList.add('shown');
            setTimeout(() => {
                alertPopup.classList.remove('shown');
                setTimeout(() => { location.href = '/' }, 1500);
            }, 3500);
        } else {
            alertPopup.innerHTML = msg.fail;
            alertPopup.classList.add('fail');
            alertPopup.classList.add('shown');
            setTimeout(() => {
                alertPopup.classList.remove('shown');
                alertPopup.classList.remove('fail');
            }, 3500);
        }
    });
});
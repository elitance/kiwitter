const form = document.querySelector('form');
const stat = document.querySelector('span.stat');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch('/account/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ un: form.querySelector('input[name=un]').value, pw: form.querySelector('input[name=pw]').value })
    }).then(async(response) => {
        const result = await response.json();
        if (!result) {
            stat.classList.remove('show');
            setTimeout(() => stat.classList.add('show'), 250);
        } else {
            location.href = '/';
        }
    });
});
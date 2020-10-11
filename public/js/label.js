document.querySelectorAll('.input input').forEach((input) => {
    input.addEventListener('focusin', (e) => {
        e.target.parentElement.querySelector('label').classList.add('focus');
        e.target.parentElement.querySelector('label').classList.add('valid');
    });
    input.addEventListener('focusout', (e) => {
        e.target.parentElement.querySelector('label').classList.remove('focus');
        if (!e.target.value) {
            e.target.parentElement.querySelector('label').classList.remove('valid');
        }
    });
});
const form = document.querySelector('form');
const pwInput = document.querySelectorAll('input[type=password]');
const unInput = document.querySelector('input[type=text]');
const submit = document.querySelector('button');
const fieldset = document.querySelector('fieldset');
const pwRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,25}$/gm;
const unRegex = /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/;

if (!document.title.includes('Log In')) {
    fieldset.disabled = true;
    document.querySelectorAll('.uInfo').forEach((input) => {
        input.addEventListener('input', (e) => {
            if (pwInput[0].value === pwInput[1].value && pwInput[0].value.length > 0 && unInput.value.length > 6) {
                if (pwRegex.test(pwInput[0].value) && unRegex.test(unInput.value)) {
                    fieldset.disabled = false;
                } else {
                    fieldset.disabled = true;
                }
            } else {
                fieldset.disabled = true;
            }
        });
    });
}
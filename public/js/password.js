const pwInput = document.querySelectorAll('input[type=password]');
const unInput = document.querySelector('input[type=text].un');
const nameInput = document.querySelectorAll('input[type=text].nf');
const fieldset = document.querySelector('fieldset');
const pwRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,30}$/gm;
const unRegex = /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/;
const nameRegex = /^[a-zA-Z]+$/;
const unavUn = ['explore', 'notifications', 'messages', 'tweet', 'account'];

document.querySelectorAll('input[type=text], input[type=password]').forEach((input) => {
    input.addEventListener('input', (e) => {
        if (pwInput[0].value === pwInput[1].value && pwInput[0].value.length > 0 && unInput.value.length > 6 && unInput.value.length < 30) {
            if (pwRegex.test(pwInput[0].value) && unRegex.test(unInput.value) && nameRegex.test(nameInput[0].value) && nameRegex.test(nameInput[0].value)) {
                let av = true;
                unavUn.forEach((un) => {
                    if (unInput.value === un) av = false;
                });
                if (av) fieldset.disabled = false;
                else fieldset.disabled = true;
            } else {
                fieldset.disabled = true;
            }
        } else {
            fieldset.disabled = true;
        }
    });
});
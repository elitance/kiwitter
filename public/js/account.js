const pwInput = document.querySelectorAll('input[type=password]');
const unInput = document.querySelector('input[type=text].un');
const nameInput = document.querySelectorAll('input[type=text].nf');
const pwRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,30}$/gm;
const unRegex = /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/;
const nameRegex = /^[a-zA-Z]+$/;
const unavUn = ['explore', 'notifications', 'messages', 'tweet', 'account'];
const form = document.querySelector('form');
const submitBtn = document.querySelector('button[type=submit]');
const stat = document.querySelector('span.fail');
const isSigninPage = location.href.includes('signin') ? true : false;
const msg = {
    signinFail: '<i></i> Incorrect username or password. Please try again.',
    signupFail: '<i></i> Account with the same username or email already exists.',
    signupSuccess: '<i></i> You are almost done! Go to your mail inbox, and verify your account!',
    formatFail: '<i></i> Please follow the formats provided.',
    loading: '<img src="/img/oval.svg">'
};


function showStat() {
    submitBtn.innerHTML = document.title;
    submitBtn.classList.remove('loading');
    stat.classList.add('hidden');
    setTimeout(() => stat.classList.remove('hidden'), 250);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let body;

    if (isSigninPage) {
        body = {
            un: form.querySelector('input[name=un]').value,
            pw: form.querySelector('input[name=pw]').value
        };
    } else {
        if (pwInput[0].value === pwInput[1].value && pwInput[0].value.length > 0 && unInput.value.length > 6 && unInput.value.length < 30 && !unavUn.includes(unInput.value)) {
            if (pwRegex.test(pwInput[0].value) && unRegex.test(unInput.value) && nameRegex.test(nameInput[0].value) && nameRegex.test(nameInput[0].value)) {
                body = {
                    fn: form.querySelector('input[name=fn]').value,
                    ln: form.querySelector('input[name=ln]').value,
                    un: form.querySelector('input[name=un]').value,
                    pw: form.querySelector('input[name=pw]').value,
                    email: form.querySelector('input[name=email]').value
                };
            } else {
                stat.innerHTML = msg.formatFail;
                showStat();
                return;
            }
        } else {
            stat.innerHTML = msg.formatFail;
            showStat();
            return;
        }
    }

    submitBtn.innerHTML = msg.loading;
    submitBtn.classList.add('loading');

    fetch(location.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }).then(async(response) => {

        const result = await response.json();

        if (isSigninPage) {
            if (!result) {
                stat.innerHTML = msg.signinFail;
                showStat();
            } else {
                location.href = '/'
            }
        } else {
            if (result) {
                stat.classList.replace('fail', 'success');
                stat.innerHTML = msg.signupSuccess;
                document.querySelectorAll('.input, button').forEach((elt) => {
                    elt.classList.add('hidden');
                    setTimeout(() => {elt.style.display = 'none'}, 200);
                });
            } else {
                stat.innerHTML = msg.signupFail;
            }

            showStat();
        }
    });
});
const signout = document.querySelector('button.signout');

signout.addEventListener('click', (e) => {
    fetch('/account/signout', { method: 'DELETE' }).then((response) => {
        location.href = '/account/signin';
    });
});
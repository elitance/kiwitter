const follow = document.querySelector('.opt button');

follow.innerText = 'Preferences';
follow.addEventListener('click', (e) => {location.href = '/account/preferences/account'});
const follow = document.querySelector('.opt button');

follow.innerText = 'Account Settings';
follow.addEventListener('click', (e) => {location.href = '/account/settings'})
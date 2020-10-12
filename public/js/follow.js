const follow = document.querySelector('.opt button');
const indicate = {
    following: () => {
        follow.classList.remove('loading');
        follow.classList.remove('unfill');
        follow.classList.add('fill');
        follow.innerText = 'Following';
    },
    loading: () => {
        follow.classList.add('loading');
        follow.innerText = 'Loading...';
    },
    follow: () => {
        follow.classList.remove('loading');
        follow.classList.remove('fill');
        follow.classList.add('unfill');
        follow.innerText = 'Follow';
    }
}

indicate.loading();
fetch(`${location.href}/follow?do=check`, { method: 'PUT' }).then(async(response) => {
    const following = await response.json();
    if (following) indicate.following();
    else indicate.follow();
});

follow.addEventListener('click', (e) => {
    indicate.loading();
    if (e.target.classList.contains('fill')) {
        fetch(`${location.href}/follow?do=unfollow`, { method: 'PUT' }).then((res) => {
            indicate.follow();
        });
    } else {
        fetch(`${location.href}/follow?do=follow`, { method: 'PUT' }).then((res) => {
            indicate.following();
        });
    }
});
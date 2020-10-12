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
fetch(`${location.href}/follow?option=check`, { method: 'PUT' }).then((res) => {
    if (res) indicate.following();
    else indicate.follow();
})

follow.addEventListener('click', (e) => {
    indicate.loading();
    if (e.target.classList.contains('fill')) {
        fetch(`${location.href}/follow?option=unfollow`, { method: 'PUT' }).then((res) => {
            indicate.follow();
        });
    } else {
        fetch(`${location.href}/follow`, { method: 'PUT' }).then((res) => {
            indicate.following();
        });
    }
});
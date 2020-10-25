const prefCats = document.querySelectorAll('a.pref-menu');
const catsArr = [...prefCats];
const mtArr = ['16px', '72px', '125px', '182px'];

if (location.hash) {
    const hashElt = document.querySelector(location.hash);
    document.querySelector('.current').classList.remove('current');
    hashElt.classList.add('current');
    document.querySelector('.bar').style.marginTop = mtArr[catsArr.indexOf(hashElt)];
} else {
    location.hash = 'account';
}

fetch(`/html/${location.hash.slice(1)}.html`).then(async(resp) => {
    const html = await resp.text();
    document.querySelector('.load').classList.add('hidden');
    document.querySelector('main').innerHTML = html;
});

prefCats.forEach((prefCat) => {
    prefCat.addEventListener('click', (e) => {
        const mt = mtArr[catsArr.indexOf(e.target)];
        const current = document.querySelector('.current');
        const bar = document.querySelector('.bar');
        bar.style.marginTop = mt;
        
        current.classList.remove('current');
        e.target.classList.add('current');
    });
});
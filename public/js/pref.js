const prefCats = document.querySelectorAll('a.pref-menu');
const catsArr = [...prefCats];
const mtArr = [16, 72, 125, 182];

if (location.hash) {
    const hashElt = document.querySelector(location.hash);
    document.querySelector('.current').classList.remove('current');
    hashElt.classList.add('current');
    document.querySelector('.bar').style.marginTop = mtArr[catsArr.indexOf(hashElt)].toString() + 'px';
}

prefCats.forEach((prefCat) => {
    prefCat.addEventListener('click', (e) => {
        const mt = mtArr[catsArr.indexOf(e.target)].toString() + 'px';
        const current = document.querySelector('.current');
        const bar = document.querySelector('.bar');
        bar.style.marginTop = mt
        
        current.classList.remove('current');
        e.target.classList.add('current');
    });
});
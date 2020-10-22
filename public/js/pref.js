const prefCats = document.querySelectorAll('a.pref-menu');
const catsArr = [...prefCats];
const mtArr = [16, 72, 125, 182];

prefCats.forEach((prefCat) => {
    prefCat.addEventListener('click', (e) => {
        e.preventDefault();
        const mt = mtArr[catsArr.indexOf(e.target)].toString() + 'px';
        const current = document.querySelector('.current');
        const bar = document.querySelector('.bar');
        bar.style.marginTop = mt
        
        current.classList.remove('current');
        e.target.classList.add('current');
        
        // if (parseInt(mt.replace('px', '')) < bar.style.marginTop) bar.classList.add('up');
        // else bar.classList.remove('up');

        // bar.style.height = mt
        // setTimeout(() => {
        //     bar.style.height = '18px';
        // }, 200);
    });
});

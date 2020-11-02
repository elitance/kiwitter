const prefCats = document.querySelectorAll('a.pref-menu');
const changeUn = document.querySelector('#chun');
const catsArr = [...prefCats];
const mtArr = ['16px', '72px', '125px', '182px'];

function loadHTML(hash) {
    fetch(`/html/${hash.slice(1)}.html`).then(async(resp) => {
        const load = document.querySelector('.load');
        const main = document.querySelector('main > .content');
        if (load.classList.contains('hidden')) {
            load.classList.remove('hidden');
            main.innerHTML = '';
        }

        const html = await resp.text();
        
        if (!html.includes('Not Found')) {
            load.classList.add('hidden');
            main.innerHTML = html;
        }
    });
}

if (location.hash) {
    const hashElt = document.querySelector(location.hash);
    document.querySelector('.current').classList.remove('current');
    hashElt.classList.add('current');
    document.querySelector('.bar').style.marginTop = mtArr[catsArr.indexOf(hashElt)];
} else {
    location.hash = 'account';
}

loadHTML(location.hash);

prefCats.forEach((prefCat) => {
    prefCat.addEventListener('click', (e) => {
        const mt = mtArr[catsArr.indexOf(e.target)];
        const current = document.querySelector('.current');
        const bar = document.querySelector('.bar');
        bar.style.marginTop = mt;
        
        current.classList.remove('current');
        e.target.classList.add('current');

        loadHTML(e.target.hash);
    });
});

if (changeUn) changeUn.addEventListener('submit', (e) => {
    fetch('/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ch: 'un', val: document.querySelector('#chun input[type=text]').value })
    }).then(async(resp) => {
        const success = await resp.json();
        if (success) {

        }
    });
});
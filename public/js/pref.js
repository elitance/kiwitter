const prefCats = document.querySelectorAll('a.pref-menu');
const changeUn = document.querySelector('#chun');
const catsArr = [...prefCats];
const mtArr = ['16px', '72px', '125px', '182px'];
const stat = document.querySelector('.addit.fail');
let val;

const msg = {
    fail: {
        un: {
            format: '<i></i> Please keep the username formats provided.',
            already: '<i></i> Username with the same username already exists.'
        }
    },
    success: {
        un: '<i></i> Username successfully changed.'
    }
};

const regex = {
    un: /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/
};

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

    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        val = document.querySelector('form input').value;
        console.log('submit');
        // if (!regex.un.test(val)) {
        //     showStat(msg.fail.un.format);
        //     return;
        // }
    
        // fetch('/preferences', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ ch: document.querySelector('form').id.slice(3), val })
        // }).then(async(resp) => {
        //     function showStat(statMsg) {
        //         stat.classList.add('hidden');
        //         stat.innerHTML = statMsg;
        //         setTimeout(() => { stat.classList.remove('hidden') }, 250);            
        //     }
            
        //     const success = await resp.json();
        //     if (success) {
        //         showStat(msg.success[document.querySelector('form').id.slice(3)]);
        //     } else {
        //         showStat(msg.fail.un.already);
        //     }
        // })
    })
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

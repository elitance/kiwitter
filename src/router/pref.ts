import express = require('express');
import db = require('../lib/mysql');
import _ = require('../lib/_');

const router: express.IRouter = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    _.html.send('pref', {
        title: 'Preferences',
        replace: { part: [req.session?.un] }, res
    });
});

router.post('/', (req: express.Request, res: express.Response) => {
    db.query('select * from account where un = ?', [req.body.val], (err, account) => {
        if (!account[0]) {
            res.send(true);
        } else {
            res.send(false);
        }
    });
});

router.post('/authorize', (req: express.Request, res: express.Response) => {
    _.html.send('auth', {
        title: 'Authorize',
        replace: { base: [req.body.ch, req.body.val] }, res
    });
});

router.post('/authorize/confirm', (req: express.Request, res: express.Response) => {
    if (_.crypto(req.body.pw) === req.session?.pw) {
        let val: string | string[];
        if (req.body.ch === 'nm') {
            val = req.body.val.split(' ');
            db.query('update account set fn = ? where un = ?', [val[0], req.session?.un], (err, account) => {
                db.query('update account set ln = ? where un = ?', [val[1], req.session?.un], (err, account) => {
                    res.send(true);
                });
            });
        } else {
            val = req.body.ch === 'pw' ? _.crypto(req.body.val) : req.body.val;
            db.query(`update account set ${req.body.ch} = ? where un = ?`, [val, req.session?.un], (err, account) => {
                if (req.session) req.session[req.body.ch] = val;
                res.send(true);
            });
        }
    } else {
        res.send(false);
    }
});

export = router;
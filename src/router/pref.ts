import express = require('express');
import url = require('url');
import db = require('../lib/mysql');
import _ = require('../lib/_');

const router: express.IRouter = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    _.html.send('pref', { title: 'Preferences', repArr: [req.session?.un], res });
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
    _.html.send('auth', { title: 'Authorize', res });
});

router.post('/authorize/check', (req: express.Request, res: express.Response) => {
    if (_.crypto(req.body.pw) === req.session?.pw) {
        res.send(true);
    } else {
        res.send(false);
    }
});

export = router;
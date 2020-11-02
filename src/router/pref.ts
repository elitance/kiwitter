import express = require('express');
import url = require('url');
import db = require('../lib/mysql');
import _ = require('../lib/_');

const router: express.IRouter = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    _.html.send('pref', { title: 'Preferences', repArr: [req.session?.un], res });
});

router.post('/', (req: express.Request, res: express.Response) => {
    db.query('select * from account where ? = ?', [req.body.ch, req.body.val], (err, account) => {
        if (!account[0]) {
            db.query('update account set ? = ? where ? = ?', [req.body.ch, req.body.val, req.body.ch, req.session?.un], (err, account) => {
                res.send(true);
            });
        } else {
            res.send(false);
        }
    });
});

export = router;
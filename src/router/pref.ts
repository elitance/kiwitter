import express = require('express');
import url = require('url');
import db = require('../lib/mysql');
import _ = require('../lib/_');

const router: express.IRouter = express.Router();

router.get('/', (req: express.Request | any, res: express.Response) => {
    const query: any = url.parse(req.url, true).query;
    if (query.ch === 'un') {
        db.query('select * from account where un = ?', [query.ch], (err, account) => {
            if (!account[0]) {
                db.query('update account set un = ? where un = ?', [query.ch, req.session.un])
            }
        })
    }

    _.html.send('pref', { title: 'Preferences', res });
});

export = router;
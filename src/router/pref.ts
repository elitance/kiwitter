import express = require('express');
import db = require('../lib/mysql');
import _ = require('../lib/_');

const router: express.IRouter = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    _.loginCheck(req, res);
    // res.redirect('/preferences/account');
    _.html.send('pref', { title: 'Preferences', res });
})

export = router;
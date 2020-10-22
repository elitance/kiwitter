import express = require('express');
import url = require('url');
import db = require('../lib/mysql');
import _ = require('../lib/_');

const router: express.IRouter = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    const hash = url.parse(req.url, true).hash;
    
    _.html.send('pref', { title: 'Preferences', res });
});

export = router;
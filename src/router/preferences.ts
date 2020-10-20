import express = require('express');
import db = require('../lib/mysql');
import _ = require('../lib/_');

const router: express.IRouter = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    _.loginCheck(req, res);
    _.html.send('base', { title: 'Preferences', part: 'preferences', res });
})

export = router;
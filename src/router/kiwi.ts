import express = require('express');
import _ = require('../lib/_');

const router: express.IRouter = express.Router();

router.get('/new', (req: express.Request, res: express.Response) => {
    // _.html.send('base', { title: 'New Kiwi', res, part: '' });
});

export = router;
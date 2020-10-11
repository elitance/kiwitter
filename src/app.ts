import express = require('express');
import compression = require('compression');
import helmet = require('helmet');
import passportInit = require('./lib/passport');
import _ = require('./lib/_');
import session = require('./lib/session');
import account = require('./router/account');
import db = require('./lib/mysql');
// import tweet = require('./router/tweet');

const app: express.Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());
app.use(session());
app.use(express.static('public'));
const passport: object = passportInit(app);
app.use('/account', account(passport));
// app.use('/tweet', tweet);

app.get('/', (req: any, res: express.Response) => {
   if (!req.user) {
      res.redirect('/account/login');
   } else {
      _.html.send('index', { title: 'Kiwitter', res, repArr: ['Home'] });
   }
});

app.get('/:username', (req: any, res: express.Response) => {
   db.query('select * from account where un = ?', [req.params.username], (err, account) => {
      if (account[0]) {
         res.send(`${account[0].fn} ${account[0].ln}`);
      } else {
         _.html.notFound(res);
      }
   });
});

app.listen(80, 'localhost');
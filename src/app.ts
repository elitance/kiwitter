import express = require('express');
import compression = require('compression');
import helmet = require('helmet');
import url = require('url');
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
      _.html.send('base', { title: 'Kiwitter', res, part: 'home', repArr: ['Home'] });
   }
});

app.get('/:username', (req: any, res: express.Response) => {
   db.query('select * from account where un = ?', [req.params.username], (err, account) => {
      if (account[0]) {
         const name = `${account[0].fn} ${account[0].ln}`;
         _.html.send('base', { title: `${name} - ${req.params.username}`, part: 'profile', repArr: [name, `@${req.params.username}`], res });
      } else {
         _.html.notFound(res);
      }
   });
});

app.get('/profile', (req: any, res: express.Response) => {
   res.redirect(`/${req.user.un}`);
});

app.put('/:username/follow', (req: any, res: express.Response) => {
   db.query('select * from account where un = ?', [req.user.un], (err, myAccount) => {
      db.query('select * from account where un = ?', [req.params.username], (err, account) => {
         if (!account[0].followers) {
            db.query('update account set followers = ? where un = ?', [myAccount[0].id, req.params.username], (err, acc) => {
               res.send();
            });
         } else {
            const query: any = url.parse(req.url, true).query;
            let already: boolean = false;
            account[0].followers.split(', ').forEach((id: string) => {
               if (id === myAccount[0].id) already = true;
            });
            if (query.option === 'check') {
               res.send(already);
            } else if (query.option === 'unfollow') {
               let result: string = '';
               account[0].followers.split(', ').forEach((id: string) => {
                  if (id !== myAccount[0].id) result += `, ${id}`;
               });
               db.query('update account set followers = ? where un = ?', [result.slice(2), req.params.username], (err, acc) => {
                  res.send();
               });
            } else {
               if (!already) db.query('update account set followers = ? where un = ?', [`${account[0].followers}, ${myAccount[0].id}`, req.params.username]);
               res.send();
            }
         }
      });
   });
});

app.listen(80, 'localhost');
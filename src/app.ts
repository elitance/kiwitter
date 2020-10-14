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

app.get('/profile', (req: any, res: express.Response) => {
   if (!req.user) res.redirect('/account/login');
   res.redirect(`/${req.user.un}`);
});

app.get('/:username', (req: any, res: express.Response) => {
   db.query('select * from account where un = ?', [req.params.username], (err, account) => {
      if (account[0]) {
         const name: string = `${account[0].fn} ${account[0].ln}`;
         let button: string = 'follow';
         if (req.params.username === req.user.un) button = 'accPrf';
         _.html.send('base', { title: `${name} - ${req.params.username}`, part: 'profile', repArr: [name, `@${req.params.username}`, button], res });
      } else {
         _.html.notFound(res);
      }
   });
});

app.put('/:username/follow', (req: any, res: express.Response) => {
   db.query('select * from account where un = ?', [req.user.un], (err, myAccount) => {
      db.query('select * from account where un = ?', [req.params.username], (err, account) => {
         const query: any = url.parse(req.url, true).query;
         let following: boolean = false;

         if (account[0].followers) {
            account[0].followers.split(', ').forEach((id: string) => {
               if (id === myAccount[0].id.toString()) following = true;
            });
         } 

         if (query.do === 'follow' && !following) {
            if (!account[0].followers) {
               db.query('update account set followers = ? where un = ?', [myAccount[0].id, account[0].un], (err, acc) => {
                  res.send();
               });
            } else {
               db.query('update account set followers = ? where un = ?', [`${account[0].followers}, ${myAccount[0].id}`, account[0].un], (err, acc) => {
                  res.send();
               });
            }
         } else if (query.do === 'unfollow' && following) {
            let followers: string = '';
            account[0].followers.split(', ').forEach((id: string) => {
               if (id !== myAccount[0].id.toString()) followers += `, ${id}`;
            });
            db.query('update account set followers = ? where un = ?', [followers.slice(2), account[0].un], (err, acc) => {
               res.send();
            });
         } else if (query.do === 'check') {
            res.send(following);
         }
      });
   });
});

app.listen(80, 'localhost');
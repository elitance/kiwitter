import express = require('express');
import compression = require('compression');
import helmet = require('helmet');
import url = require('url');
import _ = require('./lib/_');
import session = require('./lib/session');
import account = require('./router/account');
import pref = require('./router/preferences');
import db = require('./lib/mysql');

const app: express.Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(session());
app.use(express.static('public'));
app.use('/account', account);
app.use('/preferences', pref);

app.get('*', (req: any, res: express.Response, next: express.NextFunction) => {
   !req.session.un ? res.redirect('/account/signin') : next();
});

app.get('/', (req: express.Request, res: express.Response) => {
   _.html.send('base', { title: 'Kiwitter', res, part: 'home', repArr: ['Home'] });
});

app.get('/profile', (req: any, res: express.Response) => {
   res.redirect(`/${req.session.un}`);
});

app.get('/:username', (req: any, res: express.Response) => {
   db.query('select * from account where un = ?', [req.params.username], (err, account) => {
      if (account[0]) {
         const name: string = `${account[0].fn} ${account[0].ln}`;
         let button: string = 'follow';
         if (req.params.username === req.session.un) button = 'accPrf';
         _.html.send('base', { title: `${name} - @${req.params.username}`, part: 'profile', repArr: [name, req.params.username, button], res });
      } else {
         _.html.notFound(res); // Functions as not found page indicator
      }
   });
});

app.put('/:username/follow', (req: any, res: express.Response) => {
   db.query('select * from account where un = ?', [req.session.un], (err, myAccount) => {
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
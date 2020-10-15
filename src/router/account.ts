import express = require('express');
import url = require('url');
import db = require('../lib/mysql');
import _ = require('../lib/_');
import mail = require('../lib/mail');

const router: express.IRouter = express.Router();
class Account {
   private un: string;
   private pw: string;
   public email: string;
   public fn: string;
   public ln: string;

   constructor(un: string, pw: string, email: string, fn: string, ln: string) {
      this.un = un;
      this.pw = pw;
      this.email = email;
      this.fn = fn;
      this.ln = ln;
   }

   overlapCheck(res: express.Response): void {
      db.query('select * from account where un = ?', [this.un], (err, account) => {
         if (!account[0]) {
            db.query('select * from account where email = ?', [this.email], (err, account) => {
               if (!account[0]) {
                  db.query('insert into account (un, pw, email, fn, ln, vrf) values (?, ?, ?, ?, ?, ?)', [this.un, _.crypto(this.pw), this.email, this.fn, this.ln, 0], (err, account) => {
                     if (err) throw err;
                     mail.verify(this.email, account.insertId);
                     res.redirect('/account/signup?stat=success');
                  });
               } else {
                  res.redirect('/account/signup?stat=fail');
               }
            });
         } else {
            res.redirect('/account/signup?stat=fail');
         }
      });
   }
}

router.get('/signin', (req: any, res: express.Response) => {
   if (req.session.un) {
      res.redirect('/');
   } else {
      _.html.send('account', { title: 'Sign In', part: 'signin', res });
   }
});

router.post('/signin', (req: any, res: express.Response) => {
   db.query('select * from account where un = ? and pw = ? and vrf = 1', [req.body.un, _.crypto(req.body.pw)], (err, account) => {
      if (!account[0]) {
         res.send(false);
      } else {
         req.session.un = req.body.un;
         req.session.pw = _.crypto(req.body.pw);
         req.session.cookie.maxAge = 31536000000;
         res.send(true);
      }
   });
});

router.get('/signup', (req: any, res: express.Response) => {
   if (req.session.un) {
      res.redirect('/');
   } else {
      const query: any = url.parse(req.url, true).query;
      let stat: string = ' ';

      if (query.stat === 'fail') stat = '<span class="addit fail"><i></i> Account with the same username or email already exists.<br>Try again with another one.</span>';
      else if (query.stat === 'success') stat = '<span class="addit success"><i></i> You are almost done! Go to your mail inbox, and verify your account!</span>';
      _.html.send('account', { title: 'Sign Up', part: 'signup', stat, res });
   }
});

router.post('/signup', (req: express.Request, res: express.Response) => {
   const user: Account = new Account(req.body.un, req.body.pw, req.body.email, req.body.fn, req.body.ln);
   user.overlapCheck(res);
});

router.get('/verify', (req: express.Request, res: express.Response) => {
   const query: any = url.parse(req.url, true).query;
   if (query.id) {
      db.query('update account set vrf = 1 where id = ?', [query.id], (err, account) => {
         res.redirect('/account/signin');
      });
   }
});

router.delete('/signout', (req: express.Request, res: express.Response) => {
   req.session?.destroy((err: Error) => {
      if (err) throw err;
      res.send()
   });
});

router.get('/preferences', (req: express.Request, res: express.Response) => {
   _.loginCheck(req, res);
   const query: any = url.parse(req.url, true).query;
   let stat: string = ' ';

   if (query.stat === 'success') stat = '<span class="addit success"><i></i> Account preferences saved.</span>';
   _.html.send('account', { title: 'Account Preferences', part: 'preferences', stat, res });
});

export = router;
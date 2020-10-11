import express = require('express');
import url = require('url');
import db = require('../lib/mysql');
import _ = require('../lib/_');
import mail = require('../lib/mail');

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

export = (passport: any): express.IRouter => {
   const router: express.IRouter = express.Router();

   router.get('/login', (req: express.Request, res: express.Response) => {
      if (req.user) {
         res.redirect('/');
      } else {
         const query: any = url.parse(req.url, true).query;
         let stat: string = ' ';

         if (query.stat === 'fail') stat = '<span class="addit fail"><i></i> Incorrect username or password. Please try again.</span>';
         _.html.send('account', { title: 'Log In', part: 'login', stat, res });
      }
   });

   router.post('/login', (req: any, res: express.Response, next: express.NextFunction) => {
      req.session.cookie.maxAge = 31536000000;
      next();
   }, passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/account/login?stat=fail',
   }));

   router.get('/signup', (req: express.Request, res: express.Response) => {
      if (req.user) {
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
      if (query.type === 'email') {
         db.query('update account set vrf = 1 where id = ?', [query.id], (err, account) => {
            res.redirect('/account/login');
         });
      }
   });

   return router;
};
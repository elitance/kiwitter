import express = require('express');
import url = require('url');
import fs = require('fs');
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
                  mail.verify(this.un, this.pw, this.email, this.fn, this.ln);
                  res.redirect('/account/signup?stat=success');
               } else {
                  res.redirect('/account/signup?stat=fail');
               }
            });
         } else {
            res.redirect('/account/signup?stat=fail');
         }
      });
   }

   createAccount(res: express.Response): void {
      db.query('insert into account (un, pw, email, fn, ln) values (?, ?, ?, ?, ?)', [this.un, _.crypto(this.pw), this.email, this.fn, this.ln], (err, account) => {
         if (err) throw err;
         res.redirect('/account/login');
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
         let stat: string = '';

         if (query.stat === 'fail') stat = '<span class="addit fail"><i></i> Incorrect username or password. Please try again.</span>';
         res.send(_.part('account', ['Log In', stat, 'hidden', '', '', 'or Email', '']));
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
         let stat: string = '';

         if (query.stat === 'fail') stat = '<span class="addit fail"><i></i> Account with the same username or email already exists.<br>Try again with another one.</span>';
         else if (query.stat === 'success') stat = '<span class="addit success"><i></i> You are almost done! Go to your mail inbox, and verify your account!</span>';
         res.send(_.part('account', ['Sign Up', stat, '', 'hidden', 'required', '', 'unav']));
      }
   });

   router.post('/signup', (req: express.Request, res: express.Response) => {
      const user: Account = new Account(req.body.un, req.body.pw, req.body.email, req.body.fn, req.body.ln);
      user.overlapCheck(res);
   });

   router.post('/verify', (req: express.Request, res: express.Response) => {
      if (req.body.type === 'email') {
         const user: Account = new Account(req.body.un, req.body.pw, req.body.email, req.body.fn, req.body.ln);
         user.createAccount(res);
      }
   });

   return router;
};
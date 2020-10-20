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

   async overlapCheck(): Promise<boolean> {
      return await new Promise((resolve, reject) => {
         db.query('select * from account where un = ?', [this.un], (err, account) => {
            if (!account[0]) {
               db.query('select * from account where email = ?', [this.email], (err, account) => {
                  if (!account[0]) {
                     db.query('insert into account (un, pw, email, fn, ln, vrf) values (?, ?, ?, ?, ?, ?)', [this.un, _.crypto(this.pw), this.email, this.fn, this.ln, 0], (err, account) => {
                        mail.verify(this.email, account.insertId);
                        resolve(true);
                     });
                  } else {
                     resolve(false);
                  }
               });
            } else {
               resolve(false);
            }
         });
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
      _.html.send('account', { title: 'Sign Up', part: 'signup', res });
   }
});

router.post('/signup', async(req: express.Request, res: express.Response) => {
   const user: Account = new Account(req.body.un, req.body.pw, req.body.email, req.body.fn, req.body.ln);
   const available: boolean = await user.overlapCheck();
   res.send(available);
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

export = router;
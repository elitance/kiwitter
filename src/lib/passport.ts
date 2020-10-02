import express = require('express');
import passport = require('passport');
import local = require('passport-local');
import db = require('./mysql');
import _ = require('./_');

const LocalStrategy = local.Strategy;

export = (app: express.Application): object => {
   app.use(passport.initialize());
   app.use(passport.session());

   passport.serializeUser((user, done) => {
      return done(null, user);
   });

   passport.deserializeUser((user, done) => {
      return done(null, user);
   });

   passport.use(new LocalStrategy({
      usernameField: 'un',
      passwordField: 'pw',
   }, (un, pw, done) => {
      db.query('select * from account where un = ? and pw = ?', [un, _.crypto(pw)], (err, account) => {
         if (!account[0]) {
            db.query('select * from account where email = ? and pw = ?', [un, _.crypto(pw)], (err, account) => {
               if (!account[0]) {
                  return done(null, false, { message: 'Incorrect username or password.' });
               } else {
                  return done(null, { un: account[0].un, pw: _.crypto(pw) });
               }
            });
         } else {
            return done(null, { un, pw: _.crypto(pw) });
         }
      });
   }));

   return passport;
};
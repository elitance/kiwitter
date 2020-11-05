import * as sqlSession from 'express-session';
import session = require('express-session');
import mysqlSession = require('express-mysql-session');
import fs = require('fs');

const profile: any = JSON.parse(fs.readFileSync('./profile.json', 'utf-8'));
const MySQLStore = mysqlSession(sqlSession);

export = () => {
   return session({
      secret: profile.session.secret,
      resave: false,
      saveUninitialized: true,
      cookie: { sameSite: 'strict' },
      store: new MySQLStore({
         host: 'localhost',
         user: profile.mysql.user,
         password: profile.mysql.password,
         database: 'kiwitter',
      })
   });
}
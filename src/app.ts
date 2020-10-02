import express = require('express');
import fs = require('fs');
import compression = require('compression');
import helmet = require('helmet');
import passportInit = require('./lib/passport');
import _ = require('./lib/_');
import session = require('./lib/session');
import account = require('./router/account');
import tweet = require('./router/tweet');

const app: express.Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());
app.use(session());
app.use(express.static('public'));
const passport = passportInit(app);
app.use('/account', account(passport));
// app.use('/tweet', tweet);

app.get('/', (req: any, res: express.Response) => {
   if (!req.user) {
      res.redirect('/account/login');
   } else {
      _.html('Home', _.part('Home'), req);
   }
});

app.listen(3000, 'localhost');
import fs = require('fs');
import crypto = require('crypto');
import db = require('./mysql');

export = {
   html: function(title: string, content: string, req: any): string {
      return fs.readFileSync('./html/index.html', 'utf-8').replace('${1}', title).replace('${2}', `./html/${fs.readFileSync(title.toLowerCase(), 'utf-8')}`).replace('${p}', req.user.un);
   },
   part: (file: string, replace: string[] = []): string => {
      let result: string = fs.readFileSync(`./html/part/${file}.html`, 'utf-8');
      for (var i = 0; i <= replace.length; i++) {
         var regex: string = '\\$\\{' + (i + 1).toString() + '\\}';
         result = result.replace(new RegExp(regex, 'g'), replace[i]);
      }
      return result;
   },
   crypto: (string: string): string => {
      return crypto.createHash('sha512').update(string).digest('base64');
   },
};

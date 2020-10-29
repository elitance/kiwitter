import fs = require('fs');
import crypto = require('crypto');
import express = require('express');

interface TemplateOption {
   title: string;
   part?: string;
   res?: express.Response;
   repArr?: string[];
}

type Request = express.Request | any;

export = {
   html: {
      part: (file: string, repArr?: string[]): string => {
         let result: string = fs.readFileSync(`./html/part/${file}.html`, 'utf-8');
         if (repArr) {
            for (var i = 0; i < repArr.length; i++) {
               var regex: string = '\\$\\{' + (i + 1).toString() + '\\}';
               result = result.replace(new RegExp(regex, 'g'), repArr[i]);
            }
            result = result.replace(/\$\{[0-9]\}/g, '');
         }
         return result;
      },
      send: function(page: string, options: TemplateOption): string | void {
         let base: string = fs.readFileSync(`./html/${page}.html`, 'utf-8').replace('${t}', options.title);
         let result: string;
         if (options.part && !options.repArr) {
            const part: string = this.part(options.part);
            result = base.replace('${c}', part);
         } else if (options.part && !options.repArr) {
            const part: string = this.part(options.part);
            result = base.replace('${c}', part);
         } else if (options.part && options.repArr) {
            const part: string = this.part(options.part, options.repArr);
            result = base.replace('${c}', part);
         } else {
            result = base;
         }
   
         if (options.res) {
            options.res.send(result);
         } else {
            return result;
         }
      },
      notFound: function(res: express.Response): void {
         this.send('base', { title: 'Not Found', part: 'home', res, repArr: ['Not Found', 'The page you are looking for doesn\'t exist. Try again with different URL.'] });
      }
   },
   crypto: (string: string): string => {
      return crypto.createHash('sha512').update(string).digest('base64');
   },
   loginCheck: (req: any, res: express.Response): void => {
      if (!req.session.un) res.redirect('/account/login');
   },
   types: {
      Request,
   }
}
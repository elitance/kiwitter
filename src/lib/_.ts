import fs = require('fs');
import crypto = require('crypto');
import express = require('express');

interface TemplateOption {
   title: string;
   part?: string;
   res?: express.Response;
   replace?: {
      part?: string[],
      base?: string[]
   };
}

export = {
   html: {
      replace: (str: string, replace?: string[]): string => {
         if (replace) {
            for (let i = 0; i < replace.length; i++) {
               let regex: string = '\\$\\{' + (i + 1).toString() + '\\}';
               str = str.replace(new RegExp(regex, 'g'), replace[i]);
            }
            str = str.replace(/\$\{[0-9]\}/g, '');
         }
         return str;
      },
      part: function(file: string, repArr?: string[]): string {
         let part: string = fs.readFileSync(`./html/part/${file}.html`, 'utf-8');
         return this.replace(part, repArr);
      },
      send: function(page: string, options: TemplateOption): string | void {
         let base: string = fs.readFileSync(`./html/${page}.html`, 'utf-8').replace('${t}', options.title);
         let result: string;
         if (options.part && !options.replace) {
            const part: string = this.part(options.part);
            result = base.replace('${c}', part);
         } else if (options.part && options.replace) {
            let part: string = '';
            if (options.replace.base) base = this.replace(base, options.replace.base);
            if (options.replace.part) part = this.part(options.part, options.replace.part);
            result = base.replace('${c}', part);
         } else if (!options.part && options.replace) {
            if (options.replace.base) base = this.replace(base, options.replace.base);
            result = base;
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
         this.send('base', {
            title: 'Not Found',
            part: 'home',
            replace: { part: ['Not Found', 'The page you are looking for doesn\'t exist. Try again with different URL.'] }, res
         });
      },
   },
   crypto: (string: string): string => {
      return crypto.createHash('sha512').update(string).digest('base64');
   },
   loginCheck: (req: any, res: express.Response): void => {
      if (!req.session.un) res.redirect('/account/login');
   }
}
import fs = require('fs');
import crypto = require('crypto');
import express = require('express');

interface TemplateOption {
   title: string;
   stat?: string;
   part?: string;
   res?: express.Response;
   repArr?: string[];
}

export = {
   html: {
      part: (file: string, repArr?: string[]): string => {
         let result: string = fs.readFileSync(`./html/part/${file}.html`, 'utf-8');
         if (repArr) {
            for (var i = 0; i <= repArr.length; i++) {
               var regex: string = '\\$\\{' + (i + 1).toString() + '\\}';
               result = result.replace(new RegExp(regex, 'g'), repArr[i]);
            }
         }
         return result;
      },
      send: function(page: string, options: TemplateOption): string | void {
         let base: string = fs.readFileSync(`./html/${page}.html`, 'utf-8').replace('${t}', options.title);
         let result: string;
         if (options.stat && options.part && !options.repArr) {
            const part = this.part(options.part, [options.stat]);
            result = base.replace('${1}', part);
         } else if (options.part && !options.stat && !options.repArr) {
            const part = this.part(options.part);
            result = base.replace('${1}', part);
         } else if (options.repArr && !options.stat && !options.part) {
            result = this.part('../index', options.repArr).replace('${t}', options.title);
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
         this.send('index', { title: 'Not Found', repArr: ['Not Found', 'The page you are looking for doesn\'t exist. Try again with different URL.'], res });
      }
   },
   crypto: (string: string): string => {
      return crypto.createHash('sha512').update(string).digest('base64');
   },
};
import fs = require('fs');
import crypto = require('crypto');

interface TemplateOption {
   title: string;
   stat?: string;
   part?: string;
   repArr?: string[];
}

export = {
   html:{
      // static: (title: string, req: any): string => {
      //    return fs.readFileSync('./html/index.html', 'utf-8').replace('${1}', title).replace('${2}', fs.readFileSync(`./html/part/${title.toLowerCase()}.html`, 'utf-8')).replace('${p}', req.user.un);
      // },
      // dynamic: (title: string, content: string, req: any): string => {
      //    return fs.readFileSync('./html/index.html', 'utf-8').replace('${1}', title).replace('${2}', `${content}`).replace('${p}', req.user.un);
      // },
      // manual: (file: string, replace: string[] = []): string => {
      //    let result: string = fs.readFileSync(`./html/${file}.html`, 'utf-8');
      //    for (var i = 0; i <= replace.length; i++) {
      //       var regex: string = '\\$\\{' + (i + 1).toString() + '\\}';
      //       result = result.replace(new RegExp(regex, 'g'), replace[i]);
      //    }
      //    return result;
      // },
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
      auto: function(page: string, option: TemplateOption): string {
         let base = fs.readFileSync(`./html/${page}.html`, 'utf-8').replace('${t}', option.title);
         if (option.stat && option.part && !option.repArr) {
            const part = this.part(option.part, [option.stat]);
            return base.replace('${1}', part);
         } else if (option.part && !option.stat && !option.repArr) {
            const part = this.part(option.part);
            return base.replace('${1}', part);
         } else if (option.repArr && !option.stat && !option.part) {
            return this.part('../index', option.repArr).replace('${t}', option.title);
         } else {
            return base;
         }
      }
   },
   crypto: (string: string): string => {
      return crypto.createHash('sha512').update(string).digest('base64');
   },
};

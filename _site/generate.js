const fs = require("fs");
const glob = require("glob");
const YAMLJS = require("yaml-js");
const YAML = require('json-to-pretty-yaml');
// const extendify = require('extendify');
// "_data/*.yaml"
glob("_data/*.yaml", function (er, files) {
      const contents = files.map((f) => {
         const id = f.split('-')[0].split('/')[1];
         const data = YAMLJS.load(fs.readFileSync(f).toString());

         if(!fs.existsSync(`_lots/${id}`)){
      
            data['lots'].forEach(lot => {
               fs.existsSync(`_lots`) || fs.mkdirSync(`_lots`);
               fs.existsSync(`_lots/${id}`) || fs.mkdirSync(`_lots/${id}`);
               fs.writeFile(`_lots/${id}/${lot["LOT"]}.md`, `---\nSALE: "${id}"\n`+YAML.stringify(lot)+'\n---', (err) => {
                  if (err)
                     console.log(err);
                  else {
                     console.log(`${lot["LOT"]} -- File written successfully`);
                  }
               });
            });
         }

      });
});


const path = require('path');
const glob = require('glob');
var rm = require('rimraf');
console.log(process.env.npm_lifecycle_event);
const lists = ['.yml', '.dmg', '.exe', '.zip'];
const newPath = `./dist-${process.env.npm_lifecycle_event}/*`;
glob.sync(newPath).forEach((pathUrl) => {
  console.log(pathUrl, path.extname(pathUrl))
  if (!lists.includes(path.extname(pathUrl))) {
    rm(pathUrl, (err) => {
      console.log('删除完成', pathUrl, err);
    });
  }
});
const fs = require('fs');
const path = require('path');

packageInfo = fs.existsSync(path.join(__dirname, 'package.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')).toString()) : {};

const name = packageInfo.name || path.basename(__dirname);
module.exports = {
  apps: [
    {
      name, 
      script: `${__dirname}/start.sh`,
      watch: ['next.config.js', 'jsconfig.json', 'package.json', '.env'],
      watch_delay: 1000,
      ignore_watch : ['node_modules', 'client/img'],
    },
    /*{
      name: `${name}-socketio`, 
      script: `${__dirname}/socketio.sh`,
      watch: ['socketio'],
      watch_delay: 1000,
      ignore_watch : ['node_modules'],
    },*/
  ],
};

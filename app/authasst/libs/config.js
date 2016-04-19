var nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: './app/authasst/config/index.json' });

module.exports = nconf;
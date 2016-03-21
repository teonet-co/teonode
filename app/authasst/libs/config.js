var nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: './app/authasst/config.json' });

module.exports = nconf;
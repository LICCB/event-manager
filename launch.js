if (process.argv.length == 3 && process.env.LICCB_MODE === undefined) {
  process.env.LICCB_MODE = process.argv[2];
} else if (process.env.LICCB_MODE === undefined) {
  process.env.LICCB_MODE = 'prod';
}

const app = require('./server');
const logger = require('./logger');
const https = require('https');
const fs = require('fs');

if (process.env.LICCB_MODE == 'dev') {
  app.listen(3000, function () {
    logger.log('Listening on port 3000!', 'info');
  });
} else if (process.env.LICCB_MODE == 'prod'){
  https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/epm-beta.licboathouse.org/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/epm-beta.licboathouse.org/fullchain.pem')
  }, app).listen(443, function () {
    logger.log('Listening on port 443! (https)', 'info');
  });
}
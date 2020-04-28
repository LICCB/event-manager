if (process.argv.length == 3 && process.env.LICCB_MODE === undefined) {
  process.env.LICCB_MODE = process.argv[2];
} else if (process.env.LICCB_MODE === undefined) {
  process.env.LICCB_MODE = 'prod';
}

const app = require('./server');
const logger = require('./logger');
logger.module = 'launch';

if (process.env.LICCB_MODE == 'dev') {
    app.listen(3000, function () {
        logger.log('Listening on port 3000!', 'info');
      });
} else if (process.env.LICCB_MODE == 'prod'){
    app.listen(80, function () {
        logger.log('Listening on port 80!', 'info');
      });
}
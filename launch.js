const app = require('./server');
const logger = require('./logger');
logger.module = 'launch';

if (process.env.DEV === undefined) {
    app.listen(80, function () {
        logger.log('Listening on port 80!', 'info');
      });
} else {
    app.listen(3000, function () {
        logger.log('Listening on port 3000!', 'info');
      });
}
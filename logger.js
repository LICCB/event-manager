var logger = exports;

// Default minimum level to be output
logger.debugLevel = 'debug';

logger.log = function(message, level='debug') {
  // Log levels in order of increasing severity
  // 'error' should always be the highest level
  var levels = ['debug', 'info', 'warn', 'error'];

  if (levels.indexOf(level) >= levels.indexOf(logger.debugLevel)) {
    // Stringify json object messages
    if (typeof message !== 'string') {
      message = JSON.stringify(message);
    };

    // Log errors to stderr and everything else to stdout
    if (levels.indexOf(level) >= levels.indexOf('error')) {
      console.error(level+': '+message);
    } else {
      console.log(level+': '+message);
    }
  }
}
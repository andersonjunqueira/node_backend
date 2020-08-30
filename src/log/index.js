const info = (msg) => {
  log('INFO', msg, false);
}

const error = (msg) => {
  log('ERROR', msg, true);
}

const debug = (msg) => {
  log('DEBUG', msg, false);
}

const log = (level, msg, showStackTrace) => {
  switch(level) {
    case 'ERROR':
      console.error(`[${level}]`, new Date() ,msg);
      break;
    case 'INFO':
      console.info(`[${level}]`, new Date() ,msg);
      break;
    case 'DEBUG': 
      console.log(`[${level}]`, new Date() ,msg);

  }
  if(showStackTrace) {
    console.trace();
  }
}

const createLogObject = (e) => {
  return {
    message: e.message,
    statusCode: e.statusCode,
    stack: e.stack
  }
}

module.exports = Object.freeze({
  info,
  debug,
  error,
  createLogObject
});
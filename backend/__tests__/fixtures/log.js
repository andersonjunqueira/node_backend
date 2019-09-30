export default Object.freeze({
  info,
  debug,
  error,
  test,
  createLogObject
})

function info({ type = 'INFO', msg }) {
  log({ type, msg })
}

function debug({ type = 'DEBUG', msg }) {
  log({ type, msg })
}

function error({ type = 'ERROR', error }) {
  log({ type, msg: error })
}

function test(msg, e) {
  console.log(msg, e || '')
}

function log({ type, msg }) {
  // console.log(type, msg);
}

function createLogObject(e) {
  return {
    error: {
      message: e.message,
      stack: e.stack
    }
  }
}
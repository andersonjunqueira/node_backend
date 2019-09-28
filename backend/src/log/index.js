export default Object.freeze({
  info,
  debug,
  error,
  test
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
}

function log({ type, msg }) {
  console.log(type, msg);
}

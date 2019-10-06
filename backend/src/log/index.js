const info = ({ type = 'INFO', msg }) => {
  log({ type, msg })
}

const debug = ({ type = 'DEBUG', msg }) => {
  log({ type, msg })
}

const error = ({ type = 'ERROR', error }) => {
  log({ type, msg: error })
}

const test = (msg, e) => {
}

const log = ({ type, msg }) => {
  console.log(type, msg);
}

const createLogObject = (e) => {
  return {
    error: {
      message: e.message,
      stack: e.stack
    }
  }
}

export default Object.freeze({
  info,
  debug,
  error,
  test,
  createLogObject
})
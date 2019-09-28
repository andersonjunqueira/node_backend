import sanitizeHtml from 'sanitize-html'
import moment from 'moment'

import buildMakeUser from './user'
import Id from '../../Id'
import md5 from '../../md5'

const makeUser = buildMakeUser({ Id, md5, sanitize, validateEmail, moment })

export default makeUser

function sanitize(text) {
  return sanitizeHtml(text, {
    allowedIframeHostnames: ['codesandbox.io', 'repl.it']
  })
}

function validateEmail(value) {
  if (typeof value !== 'undefined') {
    const email = value.trim()
    const re = /^[a-zA-Z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/
    return re.test(email)
  }
  return false
}

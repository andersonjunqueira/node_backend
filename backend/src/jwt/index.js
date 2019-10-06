import jwt from 'jsonwebtoken'
import moment from 'moment'

const generate = ({ user, exp }) => {
  const expireOn = exp || moment.utc(Date.now()).add(1, 'hours').valueOf()
  const token = jwt.sign({ exp: expireOn, data: user }, 'secret')
  return token
}

const decode = (token) => {
  const decoded = jwt.verify(token, 'secret')
  return decoded
}

module.exports = Object.freeze({
  generate,
  decode
})

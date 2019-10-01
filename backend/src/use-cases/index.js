import moment from 'moment'

import { usersDb, tokensDb } from '../data-access'
import makeLogin from './login'
import makeCreateAccount from './createAccount'
import makeFindUserById from './findUserById'
import makeCheckToken from './checkToken'
import md5 from '../md5'
import log from '../log'
import jwt from '../jwt'

const login = makeLogin({ usersDb, tokensDb, md5, moment, log })
const createAccount = makeCreateAccount({ usersDb, md5, log })
const findUserById = makeFindUserById({ usersDb, log })
const checkToken = makeCheckToken({ usersDb, tokensDb, jwt, moment, log })

const services = Object.freeze({
  login,
  createAccount,
  findUserById,
  checkToken
})

export default services
export { 
  login, 
  createAccount,
  findUserById,
  checkToken
}

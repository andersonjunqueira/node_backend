import moment from 'moment'
import nodemailer from 'nodemailer'

import { usersDb, tokensDb } from '../data-access'
import makeLogin from './login'
import makeCreateAccount from './createAccount'
import makeFindUserById from './findUserById'
import makeCheckToken from './checkToken'
import makeForgotPassword from './forgotPassword'
import makeChangePassword from './changePassword'
import makeEmailSender from '../email/emailSender'
import makeEmailTransporter from '../email/emailTransporter'
import md5 from '../md5'
import log from '../log'
import jwt from '../jwt'

const emailTransporter = makeEmailTransporter({ nodemailer });
const emailSender = makeEmailSender({ transporter: emailTransporter, log })

const login = makeLogin({ usersDb, tokensDb, md5, moment, log })
const createAccount = makeCreateAccount({ usersDb, md5, log })
const findUserById = makeFindUserById({ usersDb, log })
const checkToken = makeCheckToken({ usersDb, tokensDb, jwt, moment, log })
const forgotPassword = makeForgotPassword({ usersDb, tokensDb, emailSender, log })
const changePassword = makeChangePassword({ usersDb, moment, emailSender, md5, log })

const services = Object.freeze({
  login,
  createAccount,
  findUserById,
  checkToken,
  forgotPassword,
  changePassword
})

export default services
export { 
  login, 
  createAccount,
  findUserById,
  checkToken,
  forgotPassword,
  changePassword
}

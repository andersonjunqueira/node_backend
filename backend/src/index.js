import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

import log from './log'
import { checkToken } from './use-cases'
import makeCallback from './middlewares/express-callback'
import makeIsAuthorized from './middlewares/isAuthorized'

import {
  postLogin,
  postCreateAccount,
  postForgotPassword,
  postChangePassword,
  getFindUserById,
  notFound,
} from './controllers'

dotenv.config()

const apiRoot = process.env.MD_API_ROOT
const app = express()
app.use(bodyParser.json())
app.use((_, res, next) => {
  res.set({ Tk: '!' })
  next()
})

const isAuthenticated = makeIsAuthorized({ checkToken, tokenType: 'LOGIN', log })
const canChangePassword = makeIsAuthorized({ checkToken, tokenType: 'PASSWORD', log })

app.post(`${apiRoot}/v0/register`, makeCallback(postCreateAccount))
app.post(`${apiRoot}/v0/login`, makeCallback(postLogin))
app.post(`${apiRoot}/v0/forgot-password`, makeCallback(postForgotPassword))
app.post(`${apiRoot}/v0/change-password`, canChangePassword, makeCallback(postChangePassword))
app.get(`${apiRoot}/v0/users/:id`, isAuthenticated, makeCallback(getFindUserById))

app.use(makeCallback(notFound))

if (process.env.MD_ENV === 'dev') {
  // listen for requests
  app.listen(3000, () => {
    log.info({ msg: 'Server is listening on port 3000' })
  })
}

export default app

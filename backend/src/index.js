import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

import log from './log'
import { checkToken } from './use-cases'
import makeCallback from './middlewares/express-callback'
import makeIsAuthenticated from './middlewares/authentication'

import {
  postLogin,
  postCreateAccount,
  getFindUser,
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

const isAuthenticated = makeIsAuthenticated({ checkToken, log })

app.post(`${apiRoot}/login`, makeCallback(postLogin))
app.post(`${apiRoot}/register`, makeCallback(postCreateAccount))
app.get(`${apiRoot}/users/:id`, isAuthenticated, makeCallback(getFindUser))

app.use(makeCallback(notFound))

if (process.env.MD_ENV === 'dev') {
  // listen for requests
  app.listen(3000, () => {
    log.info({ msg: 'Server is listening on port 3000' })
  })
}

export default app

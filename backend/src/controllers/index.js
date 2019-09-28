import log from '../log'

// import use cases
import {
  login,
  createAccount,
  findUser
} from '../use-cases'

// import controllers
import makePostLogin from './postLogin'
import makePostCreateAccount from './postCreateAccount'
import makeGetFindUser from './getFindUser'
import notFound from './not-found'

// create the controllers
const postLogin = makePostLogin({ login, log })
const postCreateAccount = makePostCreateAccount({ createAccount, log })
const getFindUser = makeGetFindUser({ findUser, log })

// export the controllers
const controller = Object.freeze({
  postLogin,
  postCreateAccount,
  getFindUser,
  notFound,
})

export default controller
export { 
  postLogin, 
  postCreateAccount, 
  getFindUser,
  notFound 
}


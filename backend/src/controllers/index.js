import log from '../log'

// import use cases
import {
  login,
  createAccount,
  findUserById
} from '../use-cases'

// import controllers
import makePostLogin from './postLogin'
import makePostCreateAccount from './postCreateAccount'
import makeGetFindUserById from './getFindUserById'
import notFound from './not-found'

// create the controllers
const postLogin = makePostLogin({ login, log })
const postCreateAccount = makePostCreateAccount({ createAccount, log })
const getFindUserById = makeGetFindUserById({ findUserById, log })

// export the controllers
const controller = Object.freeze({
  postLogin,
  postCreateAccount,
  getFindUserById,
  notFound,
})

export default controller
export { 
  postLogin, 
  postCreateAccount, 
  getFindUserById,
  notFound 
}


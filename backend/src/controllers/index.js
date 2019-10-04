import log from '../log'

// import use cases
import services from '../use-cases'

// import controllers
import makePostLogin from './postLogin'
import makePostCreateAccount from './postCreateAccount'
import makePostForgotPassword from './postForgotPassword'
import makePostChangePassword from './postChangePassword'
import makeGetFindUserById from './getFindUserById'
import notFound from './not-found'

// create the controllers
const postLogin = makePostLogin({ login: services.login, log })
const postCreateAccount = makePostCreateAccount({ createAccount: services.createAccount, log })
const postForgotPassword = makePostForgotPassword({ forgotPassword: services.forgotPassword, log })
const postChangePassword = makePostChangePassword({ changePassword: services.changePassword, log })
const getFindUserById = makeGetFindUserById({ findByUserId: services.findUserById, log })

// export the controllers
const controller = Object.freeze({
  postLogin,
  postCreateAccount,
  postForgotPassword,
  postChangePassword,
  getFindUserById,
  notFound,
})

export default controller
export { 
  postLogin, 
  postCreateAccount, 
  postForgotPassword,
  postChangePassword,
  getFindUserById,
  notFound 
}


import log from '../log'

// import use cases
import cases from '../use-cases'

// import controllers
import makePostLogin from './postLogin'
import makePostCreateAccount from './postCreateAccount'
import makePostForgotPassword from './postForgotPassword'
import makePostChangePassword from './postChangePassword'
import makeGetFindUserById from './getFindUserById'
import nf from './not-found'

// create the controllers
export const postLogin = makePostLogin({ login: cases.login, log })
export const postCreateAccount = makePostCreateAccount({ createAccount: cases.createAccount, log })
export const postForgotPassword = makePostForgotPassword({ forgotPassword: cases.forgotPassword, log })
export const postChangePassword = makePostChangePassword({ changePassword: cases.changePassword, log })
export const getFindUserById = makeGetFindUserById({ findUserById: cases.findUserById, log })
export const notFound = nf

// export the controllers
export default Object.freeze({
  postLogin,
  postCreateAccount,
  postForgotPassword,
  postChangePassword,
  getFindUserById,
  notFound,
})



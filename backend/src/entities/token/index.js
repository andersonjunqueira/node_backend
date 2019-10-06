import buildMakeToken from './token'
import Id from '../../Id'
import jwt from '../../jwt'

const makeToken = buildMakeToken({ Id, jwt })

export default makeToken
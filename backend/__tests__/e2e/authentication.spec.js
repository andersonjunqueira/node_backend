import request from 'request-promise'

import makeFakeUser from '../fixtures/user'

describe('authentication e2e', () => {

  beforeEach(async () => {
  })

  it('should create user, login and list user details', async done => {
    const user = makeFakeUser()
    const password = '12A@3456'

    // creating user 
    request({
      method: 'POST',
      uri: `http://localhost:3000/api/v0/register`,
      headers: {},
      json: true,
      body: {
        fullName: user.fullName,
        email: user.email,
        password 
      }
    }).then(async rcreate => {
      expect(rcreate.id).toBeTruthy()
      expect(rcreate.email).toBe(user.email)
      expect(rcreate.fullName).toBe(user.fullName)

      // login in
      request({
        method: 'POST',
        uri: `http://localhost:3000/api/v0/login`,
        headers: {},
        json: true,
        body: {
          email: user.email,
          password 
        }
      }).then(async rlogin => {
        expect(rlogin.accessToken).toBeTruthy()

        // get user details
        request({
          method: 'GET',
          uri: `http://localhost:3000/api/v0/users/${rcreate.id}`,
          headers: {
            Authorization: `Bearer ${rlogin.accessToken}`
          }
        }).then(async rgetuser => {
          expect(rgetuser.id).toBe(rlogin.id)
          done()
  
        }).catch(error => {
          console.log(error);
          done.fail('It is not supposed to throw any error')
        })

      }).catch(error => {
        console.log(error);
        done.fail('It is not supposed to throw any error')
      })

    }).catch(error => {
      console.log(error);
      done.fail('It is not supposed to throw any error')
    })

  })

})

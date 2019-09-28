import makeDb from '../../__test__/fixtures/db'
import makeUsersDb from './users-db'
import makeFakeUser from '../../__test__/fixtures/user'

describe('users db', () => {
  let usersDb

  beforeEach(async () => {
    usersDb = makeUsersDb({ makeDb })
  })

  it('should find user by id', async () => {
    const user = makeFakeUser()
    await usersDb.insert(user)

    const found = await usersDb.findById({ id: user.id })
    expect(found).toBeTruthy()
    expect(found.id).toBe(user.id)
  })

  it('should not find user by id', async () => {
    const user = makeFakeUser()
    await usersDb.insert(user)

    const found = await usersDb.findById({ id: '321654987' })
    expect(found).toBeFalsy()
  })
  
  it('should find user by email', async () => {
    const user = makeFakeUser()
    usersDb.insert(user)

    const found = await usersDb.findByEmail({ email: user.email })
    expect(found).toBeTruthy()
    expect(found.email).toBe(user.email)
  })

  it('should not to find user by email', async () => {
    const user = makeFakeUser()
    usersDb.insert(user); 

    const found = await usersDb.findByEmail({ email: 'abc@email.co' })
    expect(found).toBeFalsy()
  })

  it('should update user', async () => {
    // insert a user in the db
    const user = makeFakeUser()
    await usersDb.insert(user)

    // make sure the user is in the db
    const found = await usersDb.findById({ id: user.id })
    expect(found.blockedOn).toBeFalsy()

    // perform a change and update the user
    found.blockedOn = Date.now()
    await usersDb.update(found)

    // confirm update
    const check = await usersDb.findById({ id: user.id })
    expect(check).toBeTruthy()
    expect(check.blockedOn).toBeTruthy()
  })

})


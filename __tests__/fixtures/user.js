const faker = require('faker');

const md5 = require('../../src/md5');
const Id = require('../../src/Id');

const makeFakeUser = (overrides) => {
  const user = {
    id: Id.makeId(),
    fullName: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    loginRetries: 0,
    lastSuccessfullLoginOn: faker.date.recent(),
    lastFailedLoginAttemptOn: faker.date.recent(),
    blockedOn: undefined,
    createdOn: faker.date.past(),
    modifiedOn: undefined
  };
  
  user.hash = md5(user.email);

  return {
    ...user,
    ...overrides
  };
}

module.exports = makeFakeUser
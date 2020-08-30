const makeFakeUser = require('../../fixtures/user');

const md5 = require('../../../src/md5');
const makeUser = require('../../../src/entities/user');

describe('user', () => {

  it('must have id', () => {
    const user = makeFakeUser();
    user.id = '1';
    expect(() => makeUser(user)).toThrow('User must have an id.');
  });

  it('must generate an id', () => {
    const user = makeFakeUser();
    user.id = undefined;
    const check = makeUser(user);
    expect(check.getId()).toBeTruthy();
  });

  it('must automatically fill the creation date', () => {
    const user = makeFakeUser();
    user.createdOn = undefined;
    const check = makeUser(user);
    expect(check.getCreatedOn()).toBeTruthy();
  });
  
  it('must have e-mail I', () => {
    const user = makeFakeUser();
    expect(() => makeUser(user)).not.toThrow('User must have an e-mail.');
  });

  it('must have e-mail II', () => {
    const user = makeFakeUser({ email: '' });
    expect(() => makeUser(user)).toThrow('User must have a valid e-mail.');
  });

  it('must have e-mail III', () => {
    const user = makeFakeUser();
    user.email = undefined;
    expect(() => makeUser(user)).toThrow('User must have a valid e-mail.');
  });

  it('must have a valid e-mail I', () => {
    const user = makeFakeUser({ email: 'name.surname@domain.com' });
    expect(() => makeUser(user)).not.toThrow('User must have a valid e-mail.');
  })  ;

  it('must have a valid e-mail II', () => {
    const user = makeFakeUser({ email: 'namedomaincom' });
    expect(() => makeUser(user)).toThrow('User must have a valid e-mail.');
  });

  it('must have a valid e-mail III', () => {
    const user = makeFakeUser({ email: 'namedomain.com' });
    expect(() => makeUser(user)).toThrow('User must have a valid e-mail.');
  });

  it('must have a valid e-mail IV', () => {
    const user = makeFakeUser({ email: '@domain.com' });
    expect(() => makeUser(user)).toThrow('User must have a valid e-mail.');
  });

  it('must have a valid e-mail V', () => {
    const user = makeFakeUser({ email: 'name@@domain.com' });
    expect(() => makeUser(user)).toThrow('User must have a valid e-mail.');
  });

  it('must have a valid e-mail VI', () => {
    const user = makeFakeUser({ email: 'name@domain..com' });
    expect(() => makeUser(user)).toThrow('User must have a valid e-mail.');
  });

  it('must have a valid e-mail VII', () => {
    const user = makeFakeUser({ email: '.surname@domain.com' });
    expect(() => makeUser(user)).toThrow('User must have a valid e-mail.');
  });

  it('must have a valid e-mail VIII', () => {
    const user = makeFakeUser({ email: 'sur@name@domain.com' });
    expect(() => makeUser(user)).toThrow('User must have a valid e-mail.');
  });

  it('must have a password', () => {
    const user = makeFakeUser({ password: '' });
    expect(() => makeUser(user)).toThrow('User password must have a password.');
  });

  it('must have a sanitized fullName', () => {
    const user = makeFakeUser({ fullName: 'abc<img />12' });
    expect(makeUser(user).getFullName()).toBe('abc12');
  });

  it('must block the user', () => {
    const user = makeUser(makeFakeUser());
    user.block();
    expect(user.getBlockedOn()).not.toBeUndefined();
  });

  it('must unblock the user', () => {
    const user = makeUser(makeFakeUser({ blockedOn: Date.now() }));
    user.unblock();
    expect(user.getBlockedOn()).toBeUndefined();
  });

  it('must have a hash', () => {
    const user = makeUser(makeFakeUser());
    const hashedEmail = md5(user.getEmail());
    expect(user.getHash()).toBe(hashedEmail);
  });

  it('must have internal functions working', () => {
    const user = makeUser(makeFakeUser());
    expect(user.getModifiedOn()).toBeTruthy();
    expect(user.getPassword()).toBeTruthy();
    expect(user.getLoginRetries()).toBeFalsy();
    expect(user.getLastSuccessfullLoginOn()).toBeTruthy();
    expect(user.getLastFailedLoginAttemptOn()).toBeTruthy();
  });

})

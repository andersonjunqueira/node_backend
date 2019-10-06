import passwd from '../../../src/passwd'

describe('passwd', () => {

  it('must not validate empty password', () => {
    expect(passwd.checkRules('')).toEqual(['Invalid password'])
    expect(passwd.checkRules(null)).toEqual(['Invalid password'])
    expect(passwd.checkRules(undefined)).toEqual(['Invalid password'])
  })

  it('must have a minimum of 3 characters', () => {
    process.env.MD_PASSWORD_RULES = 'minlength:3'
    expect(passwd.checkRules('13')).toEqual(['Password minimum length is 3'])
    expect(passwd.checkRules('133')).toEqual([])
  })

  it('must have a maximum of 10 characters', () => {
    process.env.MD_PASSWORD_RULES = 'maxlength:10'
    expect(passwd.checkRules('12345678901')).toEqual(['Password maximum length is 10'])
    expect(passwd.checkRules('1234567890')).toEqual([])
  })

  it('must have a minimum of 2 numeric characters', () => {
    process.env.MD_PASSWORD_RULES = 'digits:2'
    expect(passwd.checkRules('abc1def')).toEqual(['Password must contain at least 2 digits'])
    expect(passwd.checkRules('abc1def2')).toEqual([])
    expect(passwd.checkRules('12abcdef2')).toEqual([])
  })

  it('must have a minimum of 2 uppercase characters', () => {
    process.env.MD_PASSWORD_RULES = 'caps:2'
    expect(passwd.checkRules('Abc1def')).toEqual(['Password must contain at least 2 uppercase characters'])
    expect(passwd.checkRules('Abc1dBf2')).toEqual([])
    expect(passwd.checkRules('12abCDef2')).toEqual([])
  })

  it('must have a minimum of 2 special characters', () => {
    process.env.MD_PASSWORD_RULES = 'special:2'
    expect(passwd.checkRules('Abc@def')).toEqual(['Password must contain at least 2 special characters - !@#$%'])
    expect(passwd.checkRules('Abc#$Bf2')).toEqual([])
  })

  it('must not have invalid characters', () => {
    process.env.MD_PASSWORD_RULES = 'minlength:1'
    expect(passwd.checkRules('@#^[/')).toEqual(['Password must contain only valid characters: 0-9, A-Z, a-z, !@#$%'])
  })

  it('must accept all mixed rules', () => {
    process.env.MD_PASSWORD_RULES = 'minlength:4,maxlength:10,digits:1,special:1,caps:1'
    expect(passwd.checkRules('Ab@defgh1j')).toEqual([])
  })

  it('must complain about mixed rules', () => {
    process.env.MD_PASSWORD_RULES = 'minlength:2,maxlength:4,digits:1,special:1,caps:1'
    expect(passwd.checkRules('^')).toEqual([
      "Password minimum length is 2",
      "Password must contain at least 1 digit",
      "Password must contain at least 1 uppercase character",
      "Password must contain at least 1 special character - !@#$%",
    ])
    expect(passwd.checkRules('^^^^^')).toEqual([
      "Password maximum length is 4",
      "Password must contain at least 1 digit",
      "Password must contain at least 1 uppercase character",
      "Password must contain at least 1 special character - !@#$%",
    ])
  })

})

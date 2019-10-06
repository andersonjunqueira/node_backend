const loadRules = () => {
  const rules = {}
  const tokens = process.env.MD_PASSWORD_RULES.split(',')
  tokens.forEach(rule => {
    const ruleToken = rule.split(':')
    rules[ruleToken[0]] = ruleToken[1]
  })
  return rules
}

const minlength = (text, param) => {
  if(text.length < param) return `Password minimum length is ${param}`
}

const maxlength = (text, param) => {
  if(text.length > param) return `Password maximum length is ${param}`
}

const digits = (text, param) => {
  if(text.replace(/[^0-9]/g,"").length < param) return `Password must contain at least ${param} digit${param > 1 ? 's' : ''}`
}

const caps = (text, param) => {
  if(text.replace(/[^A-Z]/g,"").length < param) return `Password must contain at least ${param} uppercase character${param > 1 ? 's' : ''}`
}

const special = (text, param) => {
  if(text.replace(/[^!@#$%]/g,"").length < param) return `Password must contain at least ${param} special character${param > 1 ? 's' : ''} - !@#$%`
}

const invalid = (text) => {
  if(text.replace(/[0-9a-zA-z!@#$%]/g,"").length > 0) return `Password must contain only valid characters: 0-9, A-Z, a-z, !@#$%`
}

const checkRules = password => {
  let output = []
  
  if(!password) {
    output.push('Invalid password')
    return output
  }

  const rules = loadRules()

  let r = invalid(password)
  if(!!r) output.push(r)

  if('minlength' in rules) {
    r = minlength(password, rules['minlength'])
    if(!!r) output.push(r)
  }

  if('maxlength' in rules) {
    r = maxlength(password, rules['maxlength'])
    if(!!r) output.push(r)
  }
  
  if('digits' in rules) {
    r = digits(password, rules['digits'])
    if(!!r) output.push(r)
  }

  if('caps' in rules) {
    r = caps(password, rules['caps'])
    if(!!r) output.push(r)
  }

  if('special' in rules) {
    r = special(password, rules['special'])
    if(!!r) output.push(r)
  }
  
  // console.log(output)
  return output
}

module.exports = Object.freeze({
  checkRules
})
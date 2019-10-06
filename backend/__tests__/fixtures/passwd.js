const checkRules = (password) => {
  let output = []
  if(password.length < 3) {
    output.push('Password must contain at least 3 characters.') 
  }
  return output
}

module.exports = Object.freeze({
  checkRules
})

module.exports = {
  extends: 'eslint:recommended',
  parserOptions: { 
    ecmaVersion: 6,
    sourceType: 'module'
  },
  env: {
    jest: true,
    node: true,
    mongo: true
  }
}

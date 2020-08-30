module.exports = ({ emailer }) => {

  const sendForgotPassword = (to, name, token) => {
    const url = process.env.ENV_CHANGE_PASSWORD_URL.replace('$token', token);
    const msg = `<p>Hello ${name},</p>
    <p>This message was requested by the forgot password option.</p>
    <p>Click on this link to change your password:</p>
    <p><a href='${url}'>Change your password</a></p>`;
    return emailer.send(to, '[BACKEND] Forgot Password', msg);
  }

  const sendChangedPassword = (to, name) => {
    const msg = `<p>Hello ${name},</p>
    <p>Your password was changed. If you did not change your password, please, contact the administrators</p>`
    return emailer.send(to, '[BACKEND] Password Changed', msg);
  }

  return Object.freeze({
    sendForgotPassword,
    sendChangedPassword
  });
};
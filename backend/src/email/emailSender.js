export default function buildEmailSender({ transporter, log }) {

  const sendForgotPassword = async (to, name, token) => {
    transporter.sendMail({
      from: `${process.env.MD_SMTP_FROM_NAME} <${process.env.MD_SMTP_FROM_EMAIL}>`,
      to,
      subject: '[PHYSED] Forgot Password',
      text: 'Enable html view to see this message',
      html: `<p>Hello ${name},</p>
      <p>This message was requested by the forgot password option.</p>
      <p>Click on this link to change your password:</p>
      <p><a href='http://physed.com/change-password/${token}'>Change your password</a></p>`
    });
  }

  const sendChangePassword = async (to, name) => {
    transporter.sendMail({
      from: `${process.env.MD_SMTP_FROM_NAME} <${process.env.MD_SMTP_FROM_EMAIL}>`,
      to,
      subject: '[PHYSED] Password Changed',
      text: 'Enable html view to see this message',
      html: `<p>Hello ${name},</p>
      <p>Your password was changed. If you did not change your password, please, contact the administrators</p>`
    });
  }

  const sender = Object.freeze({
    sendForgotPassword,
    sendChangePassword
  })

  return sender
}
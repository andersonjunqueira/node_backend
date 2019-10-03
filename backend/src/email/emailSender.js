export default function buildEmailSender({ transporter, log }) {

  const sendForgotPasswordEmail = async (to, name, token) => {
    transporter.sendMail({
      from: '"Fred Foo" <foo@example.com>', // sender address
      to,
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: `${to} ${name} ${token}`
    });
  }

  const sender = Object.freeze({
    sendForgotPasswordEmail
  })

  return sender
}
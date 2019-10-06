const makeEmailTransporter = ({ nodemailer }) => {
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'gerald23@ethereal.email',
      pass: 'QbsJ3BkNDqCMu6QK9A'
    }
  });
}
export default makeEmailTransporter
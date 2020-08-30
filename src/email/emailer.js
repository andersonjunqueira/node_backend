module.exports = ({ nodemailer }) => {

  const transporter = nodemailer.createTransport({
    host: process.env.ENV_SMTP_HOST,
    port: process.env.ENV_SMTP_PORT,
    auth: {
      user: process.env.ENV_SMTP_USER,
      pass: process.env.ENV_SMTP_PASSWORD
    }
  });

  return Object.freeze({
    send: (to, subject, msg, attachments) => {
      return transporter.sendMail({
        from: `${process.env.ENV_SMTP_FROM_NAME} <${process.env.ENV_SMTP_FROM_EMAIL}>`,
        to, subject, html: msg, text: 'Enable html view to see this message',
      });
    }
  });
};

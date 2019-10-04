export default function makeEmailTransporter({ nodemailer }) {
  return nodemailer.createTransport({
    host: process.env.MD_SMTP_HOST,
    port: process.env.MD_SMTP_PORT,
    auth: {
        user: process.env.MD_SMTP_USER,
        pass: process.env.MD_SMTP_PASSWORD
    }
  });
} 

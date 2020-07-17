import { purchaseTemplate } from './templates/purchase';
const nodemailer = require("nodemailer");

export class EmailService {

  static async sendPurchasedEmail(email: string) {
    let transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",
      port: 465,
      auth: {
        user: 'hello@picknmixco.co.uk',
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    return transporter.sendMail({
      from: 'hello@picknmixco.co.uk',
      to: email,
      subject: "We have recieved your order - Pick 'n' Mix Co!",
      html: purchaseTemplate.html
    });
  }
}
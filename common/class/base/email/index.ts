const nodemailer = require("nodemailer");


export class EmailService {

  static async sendEmail(email: string) {
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
      html: "Hello! We are just letting you know we have recieved your order! When your order is sent out, you will recieve another email with a tracking number! Thak you!"
    });
  }
}
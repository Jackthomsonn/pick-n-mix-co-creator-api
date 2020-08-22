import { Stripe } from 'stripe';
import { fulfilledTemplate } from './templates/fulfilled';
import { purchaseTemplate } from './templates/purchase';
const nodemailer = require("nodemailer");

export class EmailService {

  static async sendPurchasedEmail(options: { email: string, session: Stripe.Checkout.Session }) {
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
      to: options.email,
      subject: "We have recieved your order - Pick 'n' Mix Co!",
      html: purchaseTemplate(options).html
    });
  }

  static async sendFulfilledOrderStatus(options: { email: string }) {
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
      to: options.email,
      subject: "Your order is on it's way - Pick 'n' Mix Co!",
      html: fulfilledTemplate(options).html
    });
  }
}
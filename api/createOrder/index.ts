import { EmailService } from './../../common/class/base/email/index';
import { Status } from '@prisma/client';

import { BaseConnector } from './../../common/class/base/index';
import { BaseContract } from './../../common/interfaces/base-contract';
import { Response } from '../../common/class/response';
import { Stripe } from 'stripe';

export class CreateOrder extends BaseConnector implements BaseContract {
  private stripe: Stripe;

  constructor(req, res) {
    super(req, res);
    this.stripe = new Stripe(process.env.SECRET_KEY_STRIPE, {
      apiVersion: '2020-03-02'
    });

    this.start();
  }

  async start(): Promise<void> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(<string>this.req.headers[ 'stripe_address_reference' ]);

      const inventoryItems = JSON.parse(<string>this.req.query.selectedSweetIds);

      const stripeCustomer: any = await this.stripe.customers.retrieve(session.customer.toString());

      const user = await this.prisma.user.findOne({
        where: {
          email: stripeCustomer.email
        }
      });

      if (user) {
        this.req.body.data.user = {
          connect: {
            email: user.email
          }
        }
      } else {
        this.req.body.data.user = {
          create: {
            email: stripeCustomer.email
          }
        }
      }

      this.req.body.data.addressDetails = {
        create: {
          city: session.shipping.address.city,
          country: session.shipping.address.country,
          line1: session.shipping.address.line1,
          line2: session.shipping.address.line2 === null ? '' : session.shipping.address.line2,
          postal_code: session.shipping.address.postal_code,
          state: session.shipping.address.state === null ? '' : session.shipping.address.state
        }
      }

      this.req.body.data.status = Status.UNFULFILLED;

      const data = await this.prisma.order.create(this.req.body);

      for (let i = 0; i < inventoryItems.length; i++) {
        const inventory = await this.prisma.inventory.findOne({ where: { id: inventoryItems[ i ] } });

        await this.prisma.inventory.update({
          where: {
            id: inventoryItems[ i ]
          },
          data: {
            quantity: inventory.quantity - 1
          }
        });
      }

      if (user) {
        await EmailService.sendEmail(user.email);
      } else {
        await EmailService.sendEmail(stripeCustomer.email);
      }

      this.res.json(new Response().success(data));
    } catch (e) {
      console.log(e);
      this.res.status(500).json(new Response().fail('There was an error when trying to process your request', e.message));
    }
  }
}

export default ((req, res) => new CreateOrder(req, res))

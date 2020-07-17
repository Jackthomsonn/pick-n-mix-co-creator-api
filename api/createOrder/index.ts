import { EmailService } from './../../common/class/base/email/index';
import { Status, User } from '@prisma/client';

import { BaseConnector } from './../../common/class/base/index';
import { BaseContract } from './../../common/interfaces/base-contract';
import { Response } from '../../common/class/response';
import { Stripe } from 'stripe';

export class CreateOrder extends BaseConnector implements BaseContract {
  constructor(req, res) {
    super(req, res);

    this.start();
  }

  private readonly STRIPE_ADDRESS_REFERENCE = 'stripe_address_reference';

  async start(): Promise<void> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(<string>this.req.headers[ this.STRIPE_ADDRESS_REFERENCE ]);

      const inventoryItems = JSON.parse(<string>this.req.query.selectedSweetIds);

      const stripeCustomer: any = await this.stripe.customers.retrieve(session.customer.toString());

      const user = await this.prisma.user.findOne({
        where: {
          email: stripeCustomer.email
        }
      });

      this.createOrConnectUser(user, stripeCustomer);

      this.setAddressDetails(session);

      this.setStatus();

      const data = await this.prisma.order.create(this.req.body);

      await this.updateInventoryQuantity(inventoryItems);

      await this.sendEmail(user, stripeCustomer);

      this.res.json(new Response().success(data));
    } catch (e) {
      this.res.status(500).json(new Response().fail('There was an error when trying to process your request', e.message));
    }
  }

  createOrConnectUser(user: User, stripeCustomer: Stripe.Customer) {
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
  }

  setAddressDetails(session: Stripe.Checkout.Session) {
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
  }

  setStatus() {
    this.req.body.data.status = Status.UNFULFILLED;
  }

  async updateInventoryQuantity(inventoryItems: number[]) {
    for (let i = 0; i < inventoryItems.length; i++) {
      const inventory = await this.prisma.inventory.findOne({ where: { id: inventoryItems[ i ] } });

      return this.prisma.inventory.update({
        where: {
          id: inventoryItems[ i ]
        },
        data: {
          quantity: inventory.quantity - 1
        }
      });
    }
  }

  async sendEmail(user: User, stripeCustomer: Stripe.Customer) {
    if (user) {
      return await EmailService.sendPurchasedEmail(user.email);
    }

    return await EmailService.sendPurchasedEmail(stripeCustomer.email);
  }
}

export default ((req, res) => new CreateOrder(req, res))

import { EmailService } from './../../common/class/email/index';
import { Status, User, Role } from '@prisma/client';

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
    if (this.req.method === 'OPTIONS') {
      return this.res.status(200).end();
    }

    try {
      const stripeAddressReference = this.req.headers[ this.STRIPE_ADDRESS_REFERENCE ] ? this.req.headers[ this.STRIPE_ADDRESS_REFERENCE ] : this.req.query[ this.STRIPE_ADDRESS_REFERENCE ];

      const session = await this.stripe.checkout.sessions.retrieve(<string>stripeAddressReference, {
        expand: [ 'line_items' ]
      });

      const stripeCustomer: any = await this.stripe.customers.retrieve(session.customer.toString());

      const user = await this.prisma.user.findOne({
        where: {
          email: stripeCustomer.email
        }
      });

      this.createOrConnectUser(user, stripeCustomer);

      this.setAddressDetails(session);

      this.setStatus();

      const itemsToBeUpdated = [];

      this.req.body.data.lineItems.create.forEach(lineItem => {
        lineItem.productOptions.create.forEach(productOption => {
          itemsToBeUpdated.push(productOption.inventoryItem.connect.id);
        });
      });

      const orderDoesExist = await this.prisma.order.findOne({
        where: {
          stripeAddressReference: <string>stripeAddressReference
        }
      });

      if (orderDoesExist) {
        this.res.status(500).json(new Response().fail(
          'This order has already been created',
          'This order has already been created',
        ));

        return;
      }

      this.req.body.data.stripeAddressReference = stripeAddressReference;

      const data = await this.prisma.order.create(this.req.body);

      await this.updateInventoryQuantity(itemsToBeUpdated);

      await this.sendEmail({
        email: user ? user.email : stripeCustomer.email,
        session: session
      });

      this.res.json(new Response().success(data));
    } catch (e) {
      this.res.status(500).json(new Response().fail(
        'There was an error when trying to process your request',
        e.message
      ));
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
          email: stripeCustomer.email,
          roles: {
            set: Role.CUSTOMER
          }
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
    const promises = [];

    for (let i = 0; i < inventoryItems.length; i++) {
      const inventory = await this.prisma.inventory.findOne({ where: { id: inventoryItems[ i ] } });

      promises.push(this.prisma.inventory.update({
        where: {
          id: inventoryItems[ i ]
        },
        data: {
          quantity: inventory.quantity === 1 ? 0 : inventory.quantity - 1
        }
      }));
    }

    return Promise.all(promises);
  }

  async sendEmail(options: { email: string, session: Stripe.Checkout.Session }) {
    return await EmailService.sendPurchasedEmail(options);
  }
}

export default ((req, res) => new CreateOrder(req, res))

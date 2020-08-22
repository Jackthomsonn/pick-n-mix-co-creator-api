import { Role, Status, User } from '@prisma/client';

import { AllowedMethod } from './../../common/interfaces/allowed-method';
import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';
import { EmailService } from '../../common/class/email/index';
import { Guard } from './../../common/class/guard/index';
import { Response } from '../../common/class/response';
import { Stripe } from 'stripe';

export class FulfilOrder extends BaseConnector implements BaseContract {
  constructor(req, res) {
    super(req, res);
  }

  async start(): Promise<void> {
    if (this.req.method === 'OPTIONS') {
      return this.res.status(200).end();
    }

    try {
      const order = await this.prisma.order.update({
        where: {
          id: this.req.body.data.orderId
        },
        data: {
          status: Status.FULFILLED
        }
      });

      const user = await this.prisma.user.findOne({
        where: {
          id: order.userId
        }
      });

      await this.sendEmail({
        email: user.email
      });

      this.res.json(new Response().success(order));
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

  async sendEmail(options: { email: string }) {
    return await EmailService.sendFulfilledOrderStatus(options);
  }
}

export default ((req, res) => new Guard(new FulfilOrder(req, res), [ AllowedMethod.POST ], [ Role.ADMIN ]));

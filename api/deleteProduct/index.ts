import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';
import { Guard } from './../../common/class/guard/index';
import { Response } from '../../common/class/response';
import { Roles } from '@prisma/client';
import Stripe from 'stripe';

export class DeleteProduct extends BaseConnector implements BaseContract {
  private stripe: Stripe;

  constructor(req, res) {
    super(req, res);
    this.stripe = new Stripe(process.env.SECRET_KEY_STRIPE, {
      apiVersion: '2020-03-02'
    });
  }

  async start(): Promise<void> {
    try {
      const data = await this.prisma.product.delete({ where: { stripeProductReference: this.req.body.data.object.id } });

      this.res.json(new Response().success(data));
    } catch (e) {
      this.res.status(500).json(new Response().fail('There was an error when trying to process your request', e.message));
    }
  }
}

export default ((req, res) => new Guard(new DeleteProduct(req, res), [ Roles.ADMIN ]))

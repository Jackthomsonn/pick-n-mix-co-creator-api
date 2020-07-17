import { NowRequest, NowResponse } from '@vercel/node';

import { BaseContract } from './../../interfaces/base-contract';
import { PrismaClient } from '@prisma/client';
import { Stripe } from 'stripe';

export class BaseConnector implements BaseContract {
  protected prisma: PrismaClient = new PrismaClient();
  protected stripe: Stripe;

  constructor(public req: NowRequest, public res: NowResponse) {
    this.stripe = new Stripe(process.env.SECRET_KEY_STRIPE, {
      apiVersion: '2020-03-02'
    });
  }

  async start() { }
}

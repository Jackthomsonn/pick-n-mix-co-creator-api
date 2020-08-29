import { NowRequest, NowResponse } from '@vercel/node';

import { BaseContract } from './../../interfaces/base-contract';
import { PrismaClient } from '@prisma/client';
import { Stripe } from 'stripe';
import { config as setupEnvironment } from 'dotenv';

export class BaseConnector implements BaseContract {
  protected prisma: PrismaClient = new PrismaClient();
  protected stripe: Stripe;

  constructor(public req: NowRequest, public res: NowResponse) {
    setupEnvironment();

    this.stripe = new Stripe(process.env.SECRET_KEY_STRIPE, {
      apiVersion: null
    });
  }

  async start() { }
}

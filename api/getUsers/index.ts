import { OrderCreateArgs, Roles, Status } from '@prisma/client';

import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';
import { Response } from '../../common/class/response';
import { Stripe } from 'stripe';

const sendmail = require('sendmail')();

export class GetUsers extends BaseConnector implements BaseContract {
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
      const users = await this.prisma.user.findMany();

      this.res.json(new Response().success(users));
    } catch (e) {
      console.log(e);
      this.res.status(500).json(new Response().fail('There was an error when trying to process your request', e.message));
    }
  }
}

export default ((req, res) => new GetUsers(req, res))

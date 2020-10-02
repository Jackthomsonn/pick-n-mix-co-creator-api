import { MarketingEmailCreateArgs, Role } from '@prisma/client';

import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';
import { Response } from '../../common/class/response';

export class AddMarketingEmail extends BaseConnector implements BaseContract {
  constructor(req, res) {
    super(req, res);

    this.start();
  }

  async start(): Promise<void> {
    if (this.req.method === 'OPTIONS') {
      return this.res.status(200).end();
    }

    try {
      const data = await this.prisma.marketingEmail.create(this.req.body);

      this.res.json(new Response().success(data));
    } catch (e) {
      this.res.status(500).json(
        new Response().fail('There was an error when trying to process your request', e.message)
      );
    }
  }
}

export default ((req, res) => new AddMarketingEmail(req, res))

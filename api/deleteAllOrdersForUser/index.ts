import { AllowedMethod } from '../../common/interfaces/allowed-method';
import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';
import { Guard } from '../../common/class/guard/index';
import { Response } from '../../common/class/response';
import { Roles } from '@prisma/client';

export class DeleteOrdersForUser extends BaseConnector implements BaseContract {
  constructor(req, res) {
    super(req, res);
    this.start();
  }

  async start(): Promise<void> {
    try {
      const user = await this.prisma.order.deleteMany({});

      this.res.json(new Response().success(user));
    } catch (e) {
      this.res.status(500).json(new Response().fail('There was an error when trying to process your request', e.message));
    }
  }
}

export default ((req, res) => new Guard(new DeleteOrdersForUser(req, res), [ AllowedMethod.DELETE ], [ Roles.ADMIN ]))

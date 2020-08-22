import { InventoryCreateArgs, Role } from '@prisma/client';

import { AllowedMethod } from './../../common/interfaces/allowed-method';
import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';
import { Guard } from '../../common/class/guard/index';
import { Response } from '../../common/class/response';

export class UpdateInventory extends BaseConnector implements BaseContract {
  constructor(req, res) {
    super(req, res);
  }

  async start(): Promise<void> {
    try {
      const { data }: InventoryCreateArgs = this.req.body;

      await this.prisma.inventory.update({ where: { id: this.req.body.data.id }, data: this.req.body.data });

      this.res.json(new Response().success(data));
    } catch (e) {
      this.res.status(500).json(new Response().fail('There was an error when trying to process your request', e.message));
    }
  }
}

export default ((req, res) => new Guard(new UpdateInventory(req, res), [ AllowedMethod.PUT ], [ Role.ADMIN ]))

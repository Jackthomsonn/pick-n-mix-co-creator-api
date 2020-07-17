import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';
import { Response } from './../../common/class/response/index';

export class CancelOrder extends BaseConnector implements BaseContract {
  constructor(req, res) {
    super(req, res);

    this.start();
  }

  async start(): Promise<void> {
    this.res.json(new Response().success({
      cancelled: true
    }));
  }
}

export default ((req, res) => new CancelOrder(req, res));

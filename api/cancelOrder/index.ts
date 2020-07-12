import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';

export class CancelOrder extends BaseConnector implements BaseContract {
  constructor(req, res) {
    super(req, res);

    this.start();
  }

  async start(): Promise<void> {
    this.res.status(200).send({
      cancelled: true
    });
  }
}

export default ((req, res) => new CancelOrder(req, res));

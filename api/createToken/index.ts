import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';
import { Response } from '../../common/class/response/index';
import { sign } from 'jsonwebtoken';

export class CancelOrder extends BaseConnector implements BaseContract {
  constructor(req, res) {
    super(req, res);

    this.start();
  }

  async start(): Promise<void> {
    const token = sign({
      email: "hello@jackthomson.co.uk",
      roles: [ "ADMIN" ]
    }, process.env.TOKEN_SECRET);
    this.res.json(new Response().success({ token }));
  }
}

export default ((req, res) => new CancelOrder(req, res));

import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';
import { Response } from '../../common/class/response';

export class GetUsers extends BaseConnector implements BaseContract {
  constructor(req, res) {
    super(req, res);

    this.start();
  }

  async start(): Promise<void> {
    try {
      const users = await this.prisma.user.findMany();

      this.res.json(new Response().success(users));
    } catch (e) {
      this.res.status(500).json(new Response().fail('There was an error when trying to process your request', e.message));
    }
  }
}

export default ((req, res) => new GetUsers(req, res))

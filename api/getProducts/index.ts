import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';
import { Response } from '../../common/class/response';

export class GetProducts extends BaseConnector implements BaseContract {
  constructor(req, res) {
    super(req, res);

    this.start();
  }

  async start(): Promise<void> {
    try {
      const data = await this.prisma.product.findMany({
        orderBy: {
          weight: 'asc'
        }
      });

      this.res.json(new Response().success(data));
    } catch (e) {
      this.res.status(500).json(new Response().fail('There was an error when trying to process your request', e.message));
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

export default ((req, res) => new GetProducts(req, res))

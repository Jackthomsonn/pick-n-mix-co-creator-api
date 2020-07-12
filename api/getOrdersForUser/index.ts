import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';
import { Guard } from '../../common/class/guard/index';
import { Response } from '../../common/class/response';

export class GetOrdersForUser extends BaseConnector implements BaseContract {
  constructor(req, res) {
    super(req, res);
  }

  async start(): Promise<void> {
    try {
      const user = await this.prisma.user.findOne({
        where: {
          id: this.req.body.data.userId
        },
        select: {
          order: {
            select: {
              createdDate: true,
              updatedDate: true,
              status: true,
              addressDetails: {
                select: {
                  line1: true,
                  line2: true,
                  state: true,
                  country: true,
                  postal_code: true,
                  city: true
                }
              },
              lineItems: {
                select: {
                  productOptions: {
                    select: {
                      inventoryItem: {
                        select: {
                          name: true
                        }
                      }
                    }
                  },
                  product: {
                    select: {
                      price: true,
                      name: true
                    }
                  }
                }
              },
              shareable: true
            }
          }
        }
      });

      this.res.json(new Response().success(user));
    } catch (e) {
      this.res.status(500).json(new Response().fail('There was an error when trying to process your request', e.message));
    }
  }
}

export default ((req, res) => new Guard(new GetOrdersForUser(req, res)))

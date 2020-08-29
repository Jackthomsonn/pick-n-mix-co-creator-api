import { AllowedMethod } from '../../common/interfaces/allowed-method';
import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';
import { Guard } from '../../common/class/guard/index';
import { Response } from '../../common/class/response';
import { Role } from '@prisma/client';

export class GetAllOrders extends BaseConnector implements BaseContract {
  constructor(req, res) {
    super(req, res);
  }

  async start(): Promise<void> {
    try {
      const orders = await this.prisma.order.findMany({
        select: {
          id: true,
          createdDate: true,
          lineItems: {
            select: {
              product: {
                select: {
                  price: true
                }
              },
              productOptions: {
                select: {
                  inventoryItem: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          },
          status: true,
          user: {
            select: {
              email: true
            }
          }
        }
      });

      this.res.json(new Response().success(orders));
    } catch (e) {
      this.res.status(500).json(new Response().fail('There was an error when trying to process your request', e.message));
    }
  }
}

export default ((req, res) => new Guard(new GetAllOrders(req, res), [ AllowedMethod.GET ], [ Role.ADMIN ]))

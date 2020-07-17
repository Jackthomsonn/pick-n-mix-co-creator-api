import { AllowedMethod } from '../../common/interfaces/allowed-method';
import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';
import { EmailService } from './../../common/class/base/email/index';
import { Guard } from '../../common/class/guard/index';
import { Response } from '../../common/class/response';
import { Roles } from '@prisma/client';

export class GetAllOrders extends BaseConnector implements BaseContract {
  constructor(req, res) {
    super(req, res);
  }

  async start(): Promise<void> {
    try {
      const orders = await this.prisma.order.findMany({
        select: {
          createdDate: true,
          status: true,
          user: {
            select: {
              email: true,
              order: {
                select: {
                  addressDetails: {
                    select: {
                      line1: true,
                      line2: true,
                      city: true,
                      country: true,
                      postal_code: true
                    }
                  },
                  lineItems: {
                    select: {
                      product: {
                        select: {
                          name: true,
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
                  }
                }
              }
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

export default ((req, res) => new Guard(new GetAllOrders(req, res), [ AllowedMethod.GET ], [ Roles.ADMIN ]))

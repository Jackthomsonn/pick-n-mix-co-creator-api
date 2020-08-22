import { AllowedMethod } from '../../common/interfaces/allowed-method';
import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';
import { Guard } from '../../common/class/guard/index';
import { Response } from '../../common/class/response';
import { Role } from '@prisma/client';

export class UpdateProduct extends BaseConnector implements BaseContract {
  constructor(req, res) {
    super(req, res);
  }

  async start(): Promise<void> {
    try {
      const product = await this.stripe.products.retrieve(this.req.body.data.object.id)
      const productPrice = await this.stripe.prices.list({ product: this.req.body.data.object.id });

      const data = await this.prisma.product.update({
        where: { stripeProductReference: product.id },
        data: {
          price: productPrice.data[ 0 ].unit_amount,
          name: product.name,
          stripeProductReference: product.id,
          weight: parseInt(product.metadata.weight),
          amountOfSweets: parseInt(product.metadata.amountOfSweets)
        }
      });

      this.res.json(new Response().success(data));
    } catch (e) {
      this.res.status(500).json(new Response().fail('There was an error when trying to process your request', e.message));
    }
  }
}

export default ((req, res) => new Guard(new UpdateProduct(req, res), [ AllowedMethod.POST ], [ Role.ADMIN ]))

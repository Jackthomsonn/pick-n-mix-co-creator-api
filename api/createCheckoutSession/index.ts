import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';
import { Guard } from '../../common/class/guard/index';
import { Response } from '../../common/class/response';
import Stripe from 'stripe';

export class CreateCheckoutSession extends BaseConnector implements BaseContract {
  private stripe: Stripe;

  constructor(req, res) {
    super(req, res);

    this.stripe = new Stripe(process.env.SECRET_KEY_STRIPE, {
      apiVersion: '2020-03-02'
    });

    this.start();
  }

  async start(): Promise<void> {
    try {
      const checkoutSession = await this.stripe.checkout.sessions.create({
        billing_address_collection: 'auto',
        shipping_address_collection: {
          allowed_countries: [ 'GB' ],
        },
        payment_method_types: [ 'card' ],
        line_items: [ {
          quantity: 1,
          price_data: {
            product: this.req.query.productId.toString(),
            currency: 'gbp',
            unit_amount: <any>this.req.query.productPrice
          }
        } ],
        mode: 'payment',
        success_url: `http://7f3f9bb84efb.ngrok.io/api/startOrder`,
        cancel_url: 'http://7f3f9bb84efb.ngrok.io/api/cancelOrder'
      })

      this.res.json(new Response().success(checkoutSession.id));
    } catch (e) {
      this.res.status(500).json(new Response().fail('There was an error when trying to process your request', e.message));
    }
  }
}

export default ((req, res) => new CreateCheckoutSession(req, res))

import { BaseConnector } from '../../common/class/base/index';
import { BaseContract } from '../../common/interfaces/base-contract';
import { Response } from '../../common/class/response';

export class CreateCheckoutSession extends BaseConnector implements BaseContract {

  constructor(req, res) {
    super(req, res);

    this.start();
  }

  async start(): Promise<void> {
    let host;

    if (this.req.method === 'OPTIONS') {
      return this.res.status(200).end();
    }

    if (this.req.headers[ 'x-forwarded-host' ]) {
      host = `http://${ this.req.headers[ 'x-forwarded-host' ] }`;
    } else {
      host = `https://${ this.req.headers.host }`;
    }

    let successUrl = '';
    let cancelUrl = '';

    if (this.req.query.web) {
      successUrl = 'http://localhost:4200/create-order';
      cancelUrl = 'http://localhost:4200/cart';
    } else {
      successUrl = `${ host }/api/startOrder`;
      cancelUrl = `${ host }/api/cancelOrder`;
    }

    try {
      const checkoutSession = await this.stripe.checkout.sessions.create({
        billing_address_collection: 'auto',
        shipping_address_collection: {
          allowed_countries: [ 'GB' ],
        },
        payment_method_types: [ 'card' ],
        line_items: this.req.body,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl
      })

      this.res.json(new Response().success(checkoutSession.id));
    } catch (e) {
      this.res.status(500).json(new Response().fail('There was an error when trying to process your request', e.message));
    }
  }
}

export default ((req, res) => new CreateCheckoutSession(req, res))

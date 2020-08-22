import { Stripe } from 'stripe';
import mjml2html from 'mjml';

export const fulfilledTemplate = (options: { email: string, session: Stripe.Checkout.Session }) => {
  return mjml2html(`
    <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-image width="100px" src="https://cdn.shopify.com/s/files/1/0402/2586/5887/files/Profile_Photo_165x.png"></mj-image>
          <mj-divider border-color="#FF62A3"></mj-divider>
          <mj-text font-size="20px" color="#FF62A3" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">Pick 'n' Mix Co</mj-text>

          <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">Your order is on it's way!</mj-text>
          <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">We are just letting you know that your order is on it's way to you!</mj-text>

          <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">If you have any questions please contact us at hello@picknmixco.co.uk</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
    </mjml>
    `);
};

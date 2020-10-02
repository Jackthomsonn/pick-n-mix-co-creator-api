import { Stripe } from 'stripe';
import mjml2html from 'mjml';

export const purchaseTemplate = (options: { email: string, session: Stripe.Checkout.Session }) => {
  return mjml2html(`
    <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-image width="100px" src="https://cdn.shopify.com/s/files/1/0402/2586/5887/files/Profile_Photo_165x.png"></mj-image>
          <mj-divider border-color="#FF62A3"></mj-divider>
          <mj-text font-size="20px" color="#FF62A3" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">Pick 'n' Mix Co</mj-text>

          <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">Thank you for your purchase with Pick 'n' Mix Co!</mj-text>
          <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">We are just letting you know that we are getting your order ready to be shipped. We will notify you when it has been sent.</mj-text>

          <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">If you have any questions please contact us at hello@picknmixco.co.uk</mj-text>

          <mj-divider border-color="#FF62A3"></mj-divider>
          <mj-text font-size="20px" color="#FF62A3" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">Order summary</mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-group>
          <mj-column>
            ${
    options.session.line_items.data.map(lineItem => {
      return `<mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">${ lineItem.description }</mj-text>`;
    })
    }
          </mj-column>
          <mj-column>
          ${
    options.session.line_items.data.map(lineItem => {
      return `<mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">£${ (lineItem.amount_total / 100).toFixed(2) }</mj-text>`;
    })
    }
          </mj-column>
        </mj-group>
      </mj-section>
      <mj-section>
        <mj-group>
          <mj-column>
            <mj-text font-size="20px" color="#FF62A3" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">Customer information</mj-text>

            <mj-text font-size="16px" color="#555" font-weight="500" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">Shipping address</mj-text>
            <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">
              ${ options.session.shipping.address.line1 }
            </mj-text>
            ${ options.session.shipping.address.line2 ? `<mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">
              ${ options.session.shipping.address.line2 }
              </mj-text>` : undefined
    }
            
            <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">
            ${ options.session.shipping.address.city }
            </mj-text>
            <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">
            ${ options.session.shipping.address.postal_code }
            </mj-text>
          </mj-column>

        </mj-group>
      </mj-section>
    </mj-body>
    </mjml>
    `);
};

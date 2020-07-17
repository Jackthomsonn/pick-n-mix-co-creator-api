import mjml2html from 'mjml';

export const purchaseTemplate = mjml2html(`
<mjml>
<mj-body>
  <mj-section>
    <mj-column>
      <mj-image width="100px" src="https://previews.dropbox.com/p/thumb/AA1hl_a5df2CcmUBKfGjAZlF2_utzBT2nRvLYObDCYNUHZmGrOoQqjSle4FiWvlkjn20Hjs0Mq01gk3OZLb8Fr0zcZoEydJ6nUBrih7Lx78PlHrQBiUMoUI57SB7MCRKfZU0qV1ndmv271h5iPmePOql17Xiw8gEAQRyEdhGCasFj2JEyMItolp79YhDiRs_BHX4zjDypGjobhqOlqtN6YZVwYpC1ujqz6gp540WGk9IVh3O2O6yYOrUBsefxEEvHBnCxBVvl36kx4F-iRECKxraIPQRX8dIwJUIGUMzbNkJSle21Hj9HDjEdA58-LNsng4npUYxWMzFVhLGsP8oI4aCwkWQCRGHxMVHpvqEdEeIuQ/p.png?fv_content=true&size_mode=5"></mj-image>
      <mj-divider border-color="#FF62A3"></mj-divider>
      <mj-text font-size="20px" color="#FF62A3" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">Pick 'n' Mix Co</mj-text>

      <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">Thank you for your purchase!</mj-text>
      <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">Hi { name }, we're getting your order ready to be shipped. We will notify you when it has been sent.</mj-text>

      <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">If you have any questions please contact us at hello@picknmixco.co.uk</mj-text>

      <mj-divider border-color="#FF62A3"></mj-divider>
      <mj-text font-size="20px" color="#FF62A3" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">Order summary</mj-text>
    </mj-column>
  </mj-section>
  <mj-section>
    <mj-group>
      <mj-column>
        <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">{ productName }</mj-text>
      </mj-column>
      <mj-column>
        <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">{ productPrice }</mj-text>
      </mj-column>
    </mj-group>
  </mj-section>
  <mj-section>
    <mj-group>
      <mj-column>
        <mj-divider border-color="#FF62A3"></mj-divider>
        <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">Total: £{ totalPrice }</mj-text>

        <mj-divider border-color="#FF62A3"></mj-divider>
      </mj-column>
    </mj-group>
  </mj-section>
  <mj-section>
    <mj-group>
      <mj-column>
        <mj-text font-size="20px" color="#FF62A3" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">Customer information</mj-text>

        <mj-text font-size="16px" color="#555" font-weight="500" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">Shipping address</mj-text>
        <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">
          { customerName }
        </mj-text>
        <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">
          { line1 }
        </mj-text>
        <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">
          { line 2 }
        </mj-text>
        <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">
          { city }
        </mj-text>
        <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">
          { post_code }
        </mj-text>
        <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">
          { country }
        </mj-text>

      </mj-column>

    </mj-group>
  </mj-section>
  <mj-section>
    <mj-group>
      <mj-column>
        <mj-text font-size="16px" font-weight="500" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">
          Shipping method
        </mj-text>
        <mj-text font-size="16px" color="#555" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">
          Standard
        </mj-text>
      </mj-column>
    </mj-group>
  </mj-section>
</mj-body>
</mjml>
`);

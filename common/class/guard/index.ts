import { AllowedMethod } from './../../interfaces/allowed-method';
import { Response } from './../response/index';
import { User, Role } from '@prisma/client';

import { BaseConnector } from './../base/index';
import { verify } from 'jsonwebtoken';
import { Stripe } from 'stripe';

export class Guard {
  private webhookSecrets = {
    'product.deleted': process.env.PRODUCT_DELETED_WEBHOOK_SECRET,
    'product.created': process.env.PRODUCT_CREATED_WEBHOOK_SECRET,
    'product.updated': process.env.PRODUCT_UPDATED_WEBHOOK_SECRET,
  }

  private stripe: Stripe;

  constructor(private delegate: BaseConnector, private allowedMethods: AllowedMethod[], private roles?: Role[]) {
    this.stripe = new Stripe(process.env.SECRET_KEY_STRIPE, {
      apiVersion: null
    });

    this.performChecks();
  }

  isTokenValid() {
    try {
      verify(this.delegate.req.headers.authorization, process.env.TOKEN_SECRET);

      return Promise.resolve();
    } catch (e) {
      throw Error(e.message);
    }
  }

  async isStripeSignatureValid(signature: string) {
    let bodyChunks = [];

    return new Promise((resolve, reject) => {
      try {
        this.delegate.req
          .on('data', chunk => bodyChunks.push(chunk))
          .on('end', async () => {
            try {
              const rawBody = Buffer.concat(bodyChunks).toString('utf8');
              const parsedBody = JSON.parse(rawBody);

              this.stripe.webhooks.signature.verifyHeader(rawBody, signature, this.webhookSecrets[ parsedBody.type ]);
              resolve();
            } catch (e) {
              reject(new Error(e.raw.message));
            }
          })
      } catch (e) {
        reject(new Error(e))
      }
    })
  }

  hasSufficientRoles() {
    try {
      if (this.delegate.req.headers[ 'stripe-signature' ]) {
        return Promise.resolve();
      }

      const decodedToken = <User>verify(this.delegate.req.headers.authorization, process.env.TOKEN_SECRET);

      const allRolesMatched = this.roles.every(role => {
        if (!decodedToken.roles || !decodedToken.roles.length) {
          throw Error('User does not have correct priviledges');
        }

        if (decodedToken.roles.includes(role)) {
          return true;
        }

        return false;
      })

      if (allRolesMatched) {
        return Promise.resolve();
      } else {
        throw Error('User does not have all the necessary priviledges');
      }
    } catch (e) {
      throw Error(e.message);
    }
  }

  async isMethodAllowed() {
    if (this.allowedMethods.includes(<any>this.delegate.req.method)) {
      return Promise.resolve();
    }

    throw Error('Method not allowed');
  }

  async performChecks() {
    try {
      await this.isMethodAllowed();

      if (!this.delegate.req.headers.authorization) {
        if (!this.delegate.req.headers[ 'stripe-signature' ]) {
          throw Error('You must be an authorised client to perform this request');
        } else {
          await this.isStripeSignatureValid((<any>this.delegate.req.headers[ 'stripe-signature' ]));
        }
      } else {
        await this.isTokenValid();
      }

      if (this.roles && this.roles.length) {
        await this.hasSufficientRoles();
      }

      this.delegate.start();
    } catch (e) {
      this.delegate.res.json(new Response().fail('Something went wrong', e.message))
    }
  }
}
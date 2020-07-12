import { NowRequest, NowResponse } from '@vercel/node';

import { BaseContract } from './../../interfaces/base-contract';
import { PrismaClient } from '@prisma/client';

export class BaseConnector implements BaseContract {
  protected prisma: PrismaClient = new PrismaClient();

  constructor(public req: NowRequest, public res: NowResponse) { }

  async start() { }
}

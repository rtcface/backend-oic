import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(contex: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(contex);

    return ctx.getContext().req;
  }
}

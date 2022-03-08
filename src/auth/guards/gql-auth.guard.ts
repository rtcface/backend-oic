import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class GqlAuthGuard extends AuthGuard('jwt') {

    getRequest(contex: ExecutionContext): any {
        const ctx = GqlExecutionContext.create(contex);
        return ctx.getContext().req;
    }

    

}                          
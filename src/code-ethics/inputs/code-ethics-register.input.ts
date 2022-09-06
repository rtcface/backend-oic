import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CodeEthicsRegisterInput {
    @Field()
    readonly description: string;

    @Field()
    readonly url: string;

    @Field()
    readonly ente_publico: string;
}
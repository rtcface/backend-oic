import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EnterRegisterInput {
    @Field()
    readonly nombre_ente: string;

    @Field()
    readonly siglas_ente: string;
}
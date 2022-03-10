import { Field, ID, InputType } from "@nestjs/graphql";



@InputType()
export class EnteQueryInput {
    @Field(() => ID)
    readonly id: string;
    @Field()
    readonly nombre_ente: string;
    @Field()
    readonly siglas_ente: string;
    @Field()
    readonly createdAt!: Date;
    @Field()
    readonly updatedAt!: Date;
    @Field()
    readonly status: string;
}
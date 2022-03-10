import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class EnteUpdateDto {
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
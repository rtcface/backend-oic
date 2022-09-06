import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CodeEthicsRegisterDto {
    @Field(() => ID)
    readonly id: string;
    @Field()
    readonly description: string;
    @Field()
    readonly url: string;
    @Field()
    readonly ente_publico: string;
    @Field()
    readonly createdAt!: Date;
    @Field()
    readonly updatedAt!: Date;
    @Field()
    readonly status: string;    
}
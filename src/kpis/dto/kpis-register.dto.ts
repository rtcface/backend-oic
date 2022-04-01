import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class KpisRegisterDto {
    @Field(() => ID)
    readonly id: string;
    @Field()
    readonly kpi: string;
    @Field()
    readonly description: string;
    @Field()
    readonly total_casos: number;
    @Field()
    readonly createdAt!: Date;
    @Field()
    readonly updatedAt!: Date;
    @Field()
    readonly status: string; 
    @Field({ nullable: true })
    readonly ente_publico: string;   
}
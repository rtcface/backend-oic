import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class KpisQueryDto {
    @Field(() => ID, { nullable: true })
    readonly id: string;
    @Field({ nullable: true })
    readonly kpi: string;
    @Field({ nullable: true })
    readonly description: string;
    @Field({ nullable: true })
    readonly total_casos: number;
    @Field({ nullable: true })
    readonly createdAt!: Date;
    @Field()
    readonly updatedAt!: Date;
    @Field({ nullable: true })
    readonly status: string; 
    @Field({ nullable: true })
    readonly ente_publico: string;   
}
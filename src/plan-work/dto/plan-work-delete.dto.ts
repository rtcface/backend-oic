import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PlanWorkDeleteDto {
    @Field(() => ID)
    readonly id: string;
    @Field()
    readonly label: string;
    @Field()
    readonly data: string;
    @Field()
    readonly expandedIcon: string;
    @Field()
    readonly collapsedIcon: string;
    @Field()
    readonly createdAt: Date;
    @Field()
    readonly updatedAt: Date;
    @Field()
    readonly status: string;
    @Field()
    readonly ente_publico: string;
}

import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class PlanWorkQueryInput {
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
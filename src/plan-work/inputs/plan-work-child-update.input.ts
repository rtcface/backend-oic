import { Field, InputType, ID } from "@nestjs/graphql";

@InputType()
export class PlanWorkUpdate{
    @Field(() => ID)
    readonly id: string;

    @Field()
    readonly label: string;

    @Field()
    readonly data: string;

    @Field()
    readonly ente_publico: string;
}
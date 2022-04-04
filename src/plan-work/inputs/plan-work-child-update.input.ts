import { Field, InputType, ID } from "@nestjs/graphql";

@InputType()
export class PlanWorkChildUpdate{
    @Field(() => ID)
    readonly id: string;

    @Field()
    readonly label: string;

    @Field()
    readonly data: string;

    @Field()
    readonly url: string;

}
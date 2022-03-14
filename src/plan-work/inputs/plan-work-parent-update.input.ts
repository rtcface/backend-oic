import { Field, InputType, ID } from "@nestjs/graphql";

@InputType()
export class PlanWorkParentUpdate{
    @Field(() => ID)
    readonly id: string;

    @Field(() => [ID])
    readonly children: [string];
}
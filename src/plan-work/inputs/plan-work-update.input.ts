import { Field, InputType, ID } from "@nestjs/graphql";


@InputType()
export class PlanWorkUpdate{
    @Field(() => ID)
    readonly id: string;

    @Field(() => [ID])
    readonly children: [string];
}
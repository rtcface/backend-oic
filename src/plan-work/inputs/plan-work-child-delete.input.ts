import { Field, InputType,ID } from "@nestjs/graphql";

@InputType()
export class PlanWorkDeleteInput{
    @Field(() => ID)
    readonly id: string;
}
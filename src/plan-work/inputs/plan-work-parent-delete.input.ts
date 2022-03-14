import { Field, InputType,ID } from "@nestjs/graphql";

@InputType()
export class PlanWorkParentDeleteInput{
    @Field(() => ID)
    readonly id: string;
}
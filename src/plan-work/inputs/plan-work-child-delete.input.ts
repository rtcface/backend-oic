import { Field, InputType,ID } from "@nestjs/graphql";

@InputType()
export class PlanWorkChildDeleteInput{
    @Field(() => ID)
    readonly id: string;
}
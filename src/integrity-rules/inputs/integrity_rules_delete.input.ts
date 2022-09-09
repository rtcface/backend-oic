import { Field, InputType,ID } from "@nestjs/graphql";

@InputType()
export class IntegrityRuleDeleteInput{
    @Field(() => ID)
    readonly id: string;
}
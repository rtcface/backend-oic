import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class EnteDeleteInput{
    @Field(() => ID)
    readonly id: string;
}
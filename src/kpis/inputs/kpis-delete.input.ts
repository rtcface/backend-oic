import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class KpisDeleteInput {
    @Field(() => ID)
    readonly id: string;   
}
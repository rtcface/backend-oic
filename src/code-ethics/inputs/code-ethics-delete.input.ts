import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class CodeEthicsDeleteInput {
    @Field(() => ID)
    readonly id: string;
    
}
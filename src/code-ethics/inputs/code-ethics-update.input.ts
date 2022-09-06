import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class CodeEthicsUpdateInput {
    @Field(() => ID)
    readonly id: string;
    @Field()
    readonly description: string;
    @Field()
    readonly url: string;   
}
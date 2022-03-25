import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UserColaboradoresQueryInput {   
    @Field()
    readonly boss: string;
}
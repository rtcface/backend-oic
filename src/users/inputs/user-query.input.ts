import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UserColaboradoresQueryInput {   
    @Field({nullable: true})
    readonly boss: string;
    @Field({nullable: true})
    readonly ente: string;
}
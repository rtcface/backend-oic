import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CommitteColaboradoresQueryInput {   
    @Field({nullable: true})
    readonly boss: string;
    @Field({nullable: true})
    readonly ente: string;
}
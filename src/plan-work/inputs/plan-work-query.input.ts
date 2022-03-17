import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class PlanWorkQueryInput {   
    @Field()
    readonly ente_publico: string;
}
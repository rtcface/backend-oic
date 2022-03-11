import { Field, InputType } from "@nestjs/graphql";
import { IsMongoId, IsUUID } from "class-validator";

@InputType()
export class KpisRegisterInput {
    @Field()
    readonly kpi: string;
    @Field()
    readonly description: string;
    @Field()
    readonly total_casos: number;  
    @Field()
    @IsMongoId()
    readonly ente_publico: string;
}
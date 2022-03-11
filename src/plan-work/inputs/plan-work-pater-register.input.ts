import { Field, InputType } from "@nestjs/graphql";
import { IsMongoId } from "class-validator";

@InputType()
export class PlanWorkRegisterInput{

    @Field()
    readonly label: string;

    @Field()
    readonly data: string;
    
    @Field()
    @IsMongoId()
    readonly ente_publico: string;
}
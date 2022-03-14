import { Field, InputType } from "@nestjs/graphql";
import { IsMongoId } from "class-validator";

@InputType()
export class PlanWorkChildRegisterInput{

    @Field()
    @IsMongoId()
    readonly IdParent: string;

    @Field()
    readonly label: string;

    @Field()
    readonly data: string;

    @Field()
    readonly url: string;
    
}
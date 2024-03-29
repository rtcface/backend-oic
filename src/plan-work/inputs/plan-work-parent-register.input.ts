import { Field, InputType } from "@nestjs/graphql";
import { IsMongoId } from "class-validator";

@InputType()
export class PlanWorkParentRegisterInput{

    @Field()
    @IsMongoId()
   readonly IdRoot: string;

    @Field()
    readonly label: string;

    @Field()
    readonly data: string;    
}
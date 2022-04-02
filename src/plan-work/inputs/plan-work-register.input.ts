import { Field, InputType } from "@nestjs/graphql";
import { IsMongoId } from "class-validator";

@InputType()
export class PlanWorkRegisterInput{

    @Field()
     label: string;

    @Field()
     data: string;
    
    @Field()
    @IsMongoId()
     ente_publico: string;
  
   
}
import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsEmail } from "class-validator";

@InputType()
export class UserRegisterInput {

    @Field()
   readonly name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Field()
   readonly email: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    password: string;  

    

}
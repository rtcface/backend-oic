import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


@InputType()
export class LoginAuthInput {
    @Field()
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    password: string;
}

@InputType()
export class UserChangePassInput {
    @Field()
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    password: string;
    
    @Field()
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
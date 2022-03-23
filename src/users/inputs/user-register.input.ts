import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsEmail, isMongoId } from "class-validator";

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

@InputType()
export class UserContralorRegisterInput {

    @Field()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Field()
    readonly email: string;

    readonly avatar: string;

    @IsString()
    @IsNotEmpty()
    @Field()  
    ente_publico: string;

    readonly password: string;

    readonly role: string;

}


@InputType()
export class UserAdminRegisterInput {

    @Field()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Field()
    readonly email: string;

    readonly avatar: string;

    readonly password: string;

    readonly role: string;

}
import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import e from "express";


@InputType()
export class UserUpdateColaboradorInput {
    
        @IsMongoId() 
        @Field()
        readonly id: string;
    
        @IsString()
        @Field()
        readonly name: string;

        @IsString()
        @IsNotEmpty()
        @IsEmail()
        @Field()
        readonly email: string;
        
        @IsString()
        @Field()
        readonly charge: string;
        
        @IsString()
        @Field()
        readonly phone: string;
    
}

@InputType()
export class UserUpdateChangePassword{
        @IsMongoId() 
        @Field()
        id: string;

        @IsString()
        @Field()
        password: string;

}
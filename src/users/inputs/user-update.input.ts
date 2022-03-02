import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsNotEmpty, isMongoId } from "class-validator";
@InputType()
export class UserUpdateInput {
    @IsString()
    @IsNotEmpty()   
    @Field()
    readonly id: string;
                                                
    @Field()
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    password: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    readonly avatar: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    readonly status: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    readonly role: string;

    @Field()
    readonly phone: string;

    @Field()
    readonly charge: string;
    
}
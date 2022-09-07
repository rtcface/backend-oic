import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsEmail, isMongoId } from "class-validator";

@InputType()
export class EthicsCommitteRegisterInput {
    @Field()
    readonly name: string;
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Field()
    readonly email: string;      
}


    


@InputType()
export class EthicsCommitteMemberRegisterInput {
    @Field()
    readonly name: string;
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Field()
    readonly email: string; 
    @Field()
    readonly parentId: string;     
}
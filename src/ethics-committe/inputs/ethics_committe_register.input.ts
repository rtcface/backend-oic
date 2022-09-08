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
    @Field()
    readonly phone: string;
    @Field()
    readonly avatar: string;
    @IsString()
    @IsNotEmpty()
    @Field()
    readonly ente_publico: string;      
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
    readonly phone: string;
    @Field()
    readonly avatar: string;
    @Field()
    readonly charge: string; 
    @Field()
    readonly parentId: string;     
}
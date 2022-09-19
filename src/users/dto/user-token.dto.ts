import { Field, ObjectType } from "@nestjs/graphql";
import { EthicsCommitteRegisterdto } from "src/ethics-committe/dto/ethics_committe_register.dto";
import { UserRegisterdto } from "./user-register.dto";

@ObjectType()
export class UserTokenDto {
    @Field()
     haveError: boolean;

    @Field()
     Err: string;
   
    @Field()
     token: string;

    @Field()
     user: UserRegisterdto;
}


@ObjectType()
export class UserTokenCmmDto {
    @Field()
     haveError: boolean;

    @Field()
     Err: string;
   
    @Field()
     token: string;

    @Field()
     user: EthicsCommitteRegisterdto;
}
import { Field, ObjectType } from "@nestjs/graphql";
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
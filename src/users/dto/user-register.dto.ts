import { Field, ID, ObjectType,  } from "@nestjs/graphql";

@ObjectType()
export class UserRegisterdto {

    @Field(() => ID)
    readonly id: string;
    @Field()
    readonly name: string;
    @Field()
    readonly email: string;
    @Field()
    password: string;
    @Field()
    readonly charge: string;
    @Field()
    readonly phone: string;
    @Field()
    readonly createdAt!: Date;
    @Field()
    readonly status: string;
    @Field()
    readonly avatar: string;
    @Field()
    readonly role: string;
    @Field()
    readonly createByGoogle: boolean;
    @Field()
     firstSignIn: boolean;

}
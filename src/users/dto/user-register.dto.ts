import { Field, ID, ObjectType,  } from "@nestjs/graphql";
import { isEmpty } from "class-validator";


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
    @Field({nullable: true})
    readonly charge: string;    
    // permiti que el campo se pueda omitir
    @Field({nullable: true})   
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
    @Field(() => [ID], {nullable: true})
    colaboradores: string[];    

}

@ObjectType()
export class fulltree {
    @Field(() => ID)
    readonly id: string;
    @Field()
    readonly name: string;
    @Field()
    readonly email: string;
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
    @Field(() => [fulltree])
    children: fulltree[];
}


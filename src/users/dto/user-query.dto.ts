import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserQueryDto {

    @Field(() => ID,{nullable: true})
    readonly id: string;

    @Field({nullable: true})
    readonly name: string;

    @Field({nullable: true})
    readonly email: string;

    @Field({nullable: true})
    password: string;

    @Field({nullable: true})
    readonly charge: string;

    @Field({nullable: true})   
    readonly phone: string;

    @Field({nullable: true})
    readonly createdAt!: Date;

    @Field({nullable: true})
    readonly status: string;

    @Field({nullable: true})
    readonly avatar: string;

    @Field({nullable: true})
    readonly role: string;

    @Field({nullable: true})
    readonly createByGoogle: boolean;

    @Field({nullable: true})
    ente_publico: string;

    @Field({nullable: true})
    firstSignIn: boolean;

    @Field(() => [ID], {nullable: true})
    colaboradores: string[];    

}
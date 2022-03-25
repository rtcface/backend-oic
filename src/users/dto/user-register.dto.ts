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
export class UserRegisterdtoOutput {
    @Field(() => ID, {nullable: true})
    id: string;
    @Field({nullable: true})
    name: string;
    @Field({nullable: true})
    email: string;
    @Field( {nullable: true})
    charge: string;    
    @Field( {nullable: true})
    phone: string;
    @Field(  {nullable: true})
    createdAt: Date;
    @Field( {nullable: true})
    status: string;
    @Field( {nullable: true})
    avatar: string;
    @Field( {nullable: true})
    role: string;
    @Field( {nullable: true})
    createByGoogle: boolean;
    @Field( {nullable: true})
    firstSignIn: boolean;
    @Field(() => [UserRegisterdtoOutput] || [], {nullable: true})
    children: UserRegisterdtoOutput[];  
    @Field( {nullable: true})
    label : string; // Cargo del usuario
    @Field( {defaultValue: 'person'})
    type: string; // icono del usuario
    @Field( {defaultValue: 'p-person'}) 
    styleClass: string; // clase del usuario
    @Field( {defaultValue: true})
    expanded: boolean; // si el usuario esta expandido o no
    @Field( {nullable: true})
    data: UserRegisterdtoOutput; // datos del usuario


}
   

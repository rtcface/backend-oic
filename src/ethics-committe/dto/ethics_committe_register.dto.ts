import { Field, ID, ObjectType,  } from "@nestjs/graphql";



@ObjectType()
export class EthicsCommitteRegisterdto {

    @Field(() => ID,{nullable: true})
    readonly id: string;
    @Field({nullable: true})
    readonly name: string;
    
    @Field({nullable: true})
    readonly email: string;

    @Field({nullable: true})
    readonly charge: string;    
    // permiti que el campo se pueda omitir
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
    ente_publico: string;

    @Field(() => [ID], {nullable: true})
    colaboradores: string[];    

}

@ObjectType()
export class EthicsCommittedtoOutput {
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
    @Field(() => [EthicsCommittedtoOutput] || [], {nullable: true})
    children: EthicsCommittedtoOutput[];  
    @Field( {nullable: true})
    label : string; // Cargo del usuario
    @Field( {defaultValue: 'person'})
    type: string; // icono del usuario
    @Field( {defaultValue: 'p-person'}) 
    styleClass: string; // clase del usuario
    @Field( {defaultValue: true})
    expanded: boolean; // si el usuario esta expandido o no
    @Field( {nullable: true})
    data: EthicsCommittedtoOutput; // datos del usuario


}
   

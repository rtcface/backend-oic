import { Field, ID, ObjectType,  } from "@nestjs/graphql";

@ObjectType()
export class IntegrityRulesRegisterdto {
    
    @Field(() => ID, {nullable: true})
    readonly id: string;

    @Field({nullable: true})
    readonly description: string;

    @Field({nullable: true})
    readonly status: string;

}

@ObjectType()
export class answersRegister{

    @Field({nullable: true})
    integrity_rule: string;

    @Field({ nullable: true})
    apply: boolean;

    @Field({ nullable:true })
    way: string;    
}

@ObjectType()
export class IntegrityRulesHistorydto {

    @Field(() => ID, {nullable: true})
    readonly id: string;

    @Field({nullable: true})
    readonly ente_publico: string;

    @Field({nullable: true})
    readonly status: string;

    @Field( () => [ answersRegister ],{nullable: true})
    readonly children: [ answersRegister ];


}
import { Field, ID, ObjectType,  } from "@nestjs/graphql";

@ObjectType()
export class IntegrityRulesRegisterdto {
    
    @Field(() => ID, {nullable: true})
    readonly id: string;

    @Field({nullable: true})
    readonly description: string;

    @Field({nullable: true})
    readonly order: number;

    @Field({nullable: true})
    readonly status: string;

}

@ObjectType()
export class IntegrityRulesHistorydto {

    @Field(() => ID, {nullable: true})
    readonly id: string;

    @Field({nullable: true})
    readonly ente_publico: string;

    @Field({nullable: true})
    readonly status: string;

    @Field({nullable: true})
    readonly p1: boolean;
    @Field({nullable: true})
    readonly p2: boolean;
    @Field({nullable: true})
    readonly p3: boolean;
    @Field({nullable: true})
    readonly p4: boolean;
    @Field({nullable: true})
    readonly p5: boolean;
    @Field({nullable: true})
    readonly p6: boolean;
    @Field({nullable: true})
    readonly p7: boolean;
    @Field({nullable: true})
    readonly p8: boolean;
    @Field({nullable: true})
    readonly p9: boolean;
    @Field({nullable: true})
    readonly p10: boolean;
    @Field({nullable: true})
    readonly p12: boolean;
    @Field({nullable: true})
    readonly p13: boolean;
    @Field({nullable: true})
    readonly p14: boolean;
    @Field({nullable: true})
    readonly p15: boolean;
    @Field({nullable: true})
    readonly p16: boolean;
}
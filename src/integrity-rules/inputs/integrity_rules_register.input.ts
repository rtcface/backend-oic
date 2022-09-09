    import { Field, InputType } from "@nestjs/graphql";
    
    @InputType()
    export class IntegrityRuleRegisterInput{
        @Field()
        description: string;
    }

    @InputType()
    export class answersRegisterInput{
        @Field()
        integrity_rule: string;

        @Field()
        apply: boolean;

        @Field({ nullable:true })
        way: string;    
    }

    @InputType()
    export class IntegrityRuleHistoryInput{

        @Field()
        ente_publico: string;   

        @Field()
        readonly answersRegister: [ answersRegisterInput ];
    }
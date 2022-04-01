import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class PlanWorkChildQueryInput {
    @Field()
    readonly label: string;
    @Field()
    readonly data: string;
    @Field()
    readonly icon: string;    
    @Field()
    readonly createdAt: Date;
    @Field()
    readonly updatedAt: Date;
    @Field()
    readonly status: string;
   
}
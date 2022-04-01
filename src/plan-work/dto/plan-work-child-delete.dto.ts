import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PlanWorkChildDeleteDto {
    @Field(() => ID)
    readonly id: string;
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

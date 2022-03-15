import { Field, ID, ObjectType } from "@nestjs/graphql";
import { PlanWorkParentRegisterDto } from './';

@ObjectType()
export class PlanWorkRegisterDto {
    @Field(() => ID)
    readonly id: string;
    @Field()
    readonly label: string;
    @Field()
    readonly data: string;
    @Field()
    readonly expandedIcon: string;
    @Field()
    readonly collapsedIcon: string;
    @Field()
    readonly createdAt: Date;
    @Field()
    readonly updatedAt: Date;
    @Field()
    readonly status: string;
    @Field()
    readonly ente_publico: string;
    @Field(() => [ID])
    readonly children: string;
   
}

@ObjectType()
export class PlanWorkRegisterDtoOuput {
    @Field(() => ID)
    readonly id: string;
    @Field()
    readonly label: string;
    @Field()
    readonly data: string;
    @Field()
    readonly expandedIcon: string;
    @Field()
    readonly collapsedIcon: string;
    @Field()
    readonly createdAt: Date;
    @Field()
    readonly updatedAt: Date;
    @Field()
    readonly status: string;
    @Field()
    readonly ente_publico: string;
    @Field(() => [ID])
    readonly children: string;
   
}
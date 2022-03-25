import { Field, ID, ObjectType } from "@nestjs/graphql";
import { PlanWorkParentRegisterDto, PlanWorkParentRegisterDtoOutput } from './';

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
    readonly children: string[];
   
}

@ObjectType()
export class PlanWorkRegisterDtoOutput {
    @Field(() => ID)
     id: string;
    @Field()
     label: string;
    @Field()
     data: string;
    @Field()
     expandedIcon: string;
    @Field()
     collapsedIcon: string;
    @Field()
     createdAt: Date;
    @Field()
     updatedAt: Date;
    @Field()
     status: string;
    @Field()
     ente_publico: string;
    @Field(() => [PlanWorkParentRegisterDtoOutput] || [], {nullable: true})
     children: PlanWorkParentRegisterDtoOutput[];
   
}
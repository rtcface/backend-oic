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
    @Field(() => ID,{nullable: true})
     id: string;
    @Field({nullable: true})
     label: string;
    @Field({nullable: true})
     data: string;
    @Field({nullable: true})
     expandedIcon: string;
    @Field({nullable: true})
     collapsedIcon: string;
    @Field({nullable: true})
     createdAt: Date;
    @Field({nullable: true})
     updatedAt: Date;
    @Field({nullable: true})
     status: string;
    @Field({nullable: true})
     ente_publico: string;
    @Field(() => [PlanWorkParentRegisterDtoOutput] || [], {nullable: true})
     children: PlanWorkParentRegisterDtoOutput[];
   
}
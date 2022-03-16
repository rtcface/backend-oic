import { Field, ID, ObjectType } from "@nestjs/graphql";
import { PlanWorkChildRegisterDto } from ".";


@ObjectType()
export class PlanWorkParentRegisterDto {
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
    @Field(() => [ID])
    readonly children: string;
  
   
}

@ObjectType()
export class PlanWorkParentRegisterDtoOutput {
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
    @Field(() => [PlanWorkChildRegisterDto])
    readonly children: PlanWorkChildRegisterDto[];
  
   
}
import { Field, ObjectType } from "@nestjs/graphql";

import { PlanWorkQueryDto } from './';

@ObjectType()
export class PlanWorkDataDto{

    @Field(() => PlanWorkQueryDto)
    readonly data: PlanWorkQueryDto;

}
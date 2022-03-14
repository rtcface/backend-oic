import { Field, ObjectType } from "@nestjs/graphql";

import { PlanWorkQueryDto } from './';
import { TreeRootDto } from './tree-root.dto';

@ObjectType()
export class PlanWorkDataDto{

    @Field()
    readonly data: "";

}
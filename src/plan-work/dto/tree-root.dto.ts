import { Field, ObjectType } from "@nestjs/graphql";
import { PlanWorkRegisterDto, PlanWorkParentRegisterDto, PlanWorkChildRegisterDto } from '.';


@ObjectType()
export class TreeRootDto {
    @Field()
    readonly root: PlanWorkRegisterDto;
    // @Field()
    // readonly children: TreeParentDto[];

}


@ObjectType()
export class TreeParentDto {
    @Field()
    readonly parent: PlanWorkParentRegisterDto;
    // @Field()
    // readonly children: PlanWorkChildRegisterDto[];

}

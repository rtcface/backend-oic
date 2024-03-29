import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PlanWorkChildRegisterDto {
    @Field(() => ID)
    readonly id: string;
    @Field()
    readonly label: string;
    @Field()
    readonly data: string;
    @Field()
    readonly url: string;
    @Field()
    readonly icon: string;   
    @Field()
    readonly createdAt: Date;
    @Field()
    readonly updatedAt: Date;
    @Field()
    readonly status: string;
   
    
}

@ObjectType()
export class PlanWorkChildRegisterDtoOutput {
    @Field(() => ID)
     id: string;
    @Field()
     label: string;
    @Field()
     data: string;
    @Field()
     url: string;
    @Field()
    icon: string;  
    @Field()
     createdAt: Date;
    @Field()
     updatedAt: Date;
    @Field()
     status: string;
   
    
}
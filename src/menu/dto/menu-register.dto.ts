// generate dto for menu
import {Field,ID,ObjectType} from '@nestjs/graphql';

@ObjectType()
export class MenuRegisterdto {
    @Field(() => ID)
    readonly id: string;
    @Field()
    readonly label: string;
    @Field()
    readonly icon: string;
    @Field()
    readonly routerLink: string;    
    @Field()
    readonly role: string;
    @Field()
    readonly status: string;
    @Field()
    readonly createdAt!: Date;
    @Field()
    readonly updatedAt!: Date;
}
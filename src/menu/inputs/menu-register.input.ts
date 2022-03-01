import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MenuRegisterInput {
    @Field()
    readonly label: string;

    @Field()
    readonly icon: string;

    @Field()
    readonly routerLink: string;
    
}
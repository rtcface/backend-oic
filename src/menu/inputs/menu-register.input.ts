import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MenuRegisterInput {
    @Field()
    readonly label: string;

    @Field()
    readonly icon: string;

    @Field()
    readonly routerLink: string;

    @Field()
    readonly role: string;

    @Field()
    readonly portal: string;

    @Field()
    readonly order: number;
    
}

@InputType()
export class MenuQueryInput {
    @Field()
    readonly role: string;
    @Field()
    readonly portal: string;
}


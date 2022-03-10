import { Field, InputType, ID } from "@nestjs/graphql";

@InputType()
export class KpisUpdateInput {
    @Field(() => ID)
    readonly id: string;

    @Field()
    readonly kpi: string;

    @Field()
    readonly description: string;

    @Field()
    readonly total_casos: number;

    @Field()
    readonly updatedAt!: Date;
}
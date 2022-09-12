import { Field, InputType,ID } from "@nestjs/graphql";

@InputType()
export class HistoryRuleByIdInput{
    @Field(() => ID)
    readonly id: string;
}


@InputType()
export class HistoryRuleByEnteInput{
    @Field()
    readonly ente_publico: string;

    @Field({nullable: true})
    status: string;
}
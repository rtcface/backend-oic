import { Field, InputType} from '@nestjs/graphql';

@InputType()
export class KpisQueryInput {
    @Field()
    readonly kpi: string;
    @Field()
    readonly description: string;
    @Field()
    readonly total_casos: number;   
}

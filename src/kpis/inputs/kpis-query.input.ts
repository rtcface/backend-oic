import { Field, InputType} from '@nestjs/graphql';
import { isMongoId, IsMongoId } from 'class-validator';

@InputType()
export class KpisQueryInput {
    @Field()
    readonly kpi: string;
    @Field()
    readonly description: string;
    @Field()
    readonly total_casos: number;   
}


@InputType()
export class KpisByEnteQueryInput {
    @Field()
    @IsMongoId()
    readonly ente_publico: string;    
}
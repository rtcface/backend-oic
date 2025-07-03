import { Field, InputType, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

@InputType()
export class KpisUpdateInput {
  @IsMongoId()
  @IsNotEmpty()
  @Field(() => ID)
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  readonly kpi: string;

  @IsString()
  @IsOptional()
  @Field()
  readonly description: string;

  @Field()
  readonly total_casos: number;

  @Field()
  readonly updatedAt!: Date;
}

import { Field, InputType, ID } from '@nestjs/graphql';
import { IsMongoId, IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class PlanWorkParentUpdate {
  @IsMongoId()
  @IsNotEmpty()
  @Field(() => ID)
  readonly id: string;

  @IsString()
  @IsOptional()
  @Field(() => [ID])
  readonly children: [string];

  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  data?: string;
}

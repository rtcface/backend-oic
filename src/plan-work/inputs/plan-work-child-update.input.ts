import { Field, InputType, ID } from '@nestjs/graphql';
import { IsMongoId, IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class PlanWorkChildUpdate {
  @IsMongoId()
  @IsNotEmpty()
  @Field(() => ID)
  readonly id: string;

  @IsString()
  @IsOptional()
  @Field()
  readonly label: string;

  @IsString()
  @IsOptional()
  @Field()
  readonly data: string;

  @Field()
  readonly url: string;
}

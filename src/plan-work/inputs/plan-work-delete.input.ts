import { Field, InputType, ID } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@InputType()
export class PlanWorkDeleteInput {
  @IsMongoId()
  @IsNotEmpty()
  @Field(() => ID)
  readonly id: string;
}

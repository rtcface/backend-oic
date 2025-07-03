import { Field, InputType, ID } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class HistoryRuleByIdInput {
  @IsMongoId()
  @IsNotEmpty()
  @Field(() => ID)
  readonly id: string;
}

@InputType()
export class HistoryRuleByEnteInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  readonly ente_publico: string;

  @Field({ nullable: true })
  status: string;
}

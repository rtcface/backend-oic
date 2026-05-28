import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class CommitteColaboradoresQueryInput {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  readonly boss: string;
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  readonly ente: string;
}

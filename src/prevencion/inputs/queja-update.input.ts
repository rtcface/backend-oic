import { Field, InputType } from '@nestjs/graphql';

@InputType('QuejaUpdateInput')
export class QuejaUpdateInput {
  @Field({ nullable: true })
  readonly procedentes?: number;

  @Field({ nullable: true })
  readonly improcedentes?: number;
}

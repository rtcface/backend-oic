import { Field, InputType } from '@nestjs/graphql';

@InputType('QuejaInput')
export class QuejaRegisterInput {
  @Field()
  readonly procedentes: number;

  @Field({ defaultValue: 0 })
  readonly improcedentes: number;
}

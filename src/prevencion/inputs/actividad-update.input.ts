import { Field, InputType } from '@nestjs/graphql';

@InputType('ActividadUpdateInput')
export class ActividadUpdateInput {
  @Field({ nullable: true })
  readonly titulo?: string;

  @Field({ nullable: true })
  readonly descripcion?: string;
}

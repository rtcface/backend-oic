import { Field, InputType } from '@nestjs/graphql';
import { EvidenceInput } from './evidence.input';

@InputType('ActividadInput')
export class ActividadRegisterInput {
  @Field()
  readonly titulo: string;

  @Field({ nullable: true })
  readonly descripcion?: string;

  @Field(() => [EvidenceInput], { nullable: true })
  readonly evidencias?: EvidenceInput[];
}

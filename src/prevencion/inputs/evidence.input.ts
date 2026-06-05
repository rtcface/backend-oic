import { Field, InputType } from '@nestjs/graphql';

@InputType('EvidenceInput')
export class EvidenceInput {
  @Field()
  readonly titulo: string;

  @Field()
  readonly archivo: string;
}

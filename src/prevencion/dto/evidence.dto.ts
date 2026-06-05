import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EvidenceDto {
  @Field()
  readonly titulo: string;

  @Field()
  readonly archivo: string;
}

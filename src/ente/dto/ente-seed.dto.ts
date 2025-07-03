import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EnteSeedDto {
  @Field()
  message: string;

  @Field()
  count: number;
}

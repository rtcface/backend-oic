import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EnteQueryDto } from '../../ente/dto';

@ObjectType()
export class QuejaQueryDto {
  @Field(() => ID)
  readonly id: string;

  @Field()
  readonly procedentes: number;

  @Field()
  readonly improcedentes: number;

  @Field(() => EnteQueryDto)
  readonly ente_publico: EnteQueryDto;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;

  @Field()
  readonly status: string;

  @Field({ nullable: true })
  readonly success?: boolean;
}

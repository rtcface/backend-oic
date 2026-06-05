import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EvidenceDto } from './evidence.dto';
import { EnteQueryDto } from '../../ente/dto';

@ObjectType()
export class ActividadQueryDto {
  @Field(() => ID)
  readonly id: string;

  @Field()
  readonly titulo: string;

  @Field()
  readonly descripcion: string;

  @Field(() => [EvidenceDto])
  readonly evidencias: EvidenceDto[];

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

import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserQueryDto {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  charge: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  createdAt!: Date;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  role: string;

  @Field({ nullable: true })
  createByGoogle: boolean;

  @Field({ nullable: true })
  ente_publico: string;

  @Field({ nullable: true })
  firstSignIn: boolean;

  @Field(() => [ID], { nullable: true })
  colaboradores: string[];
}

import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class IntegrityRuleRegisterInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  description: string;
  @Field()
  order: number;
}

@InputType()
export class IntegrityRuleHistoryInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  ente_publico: string;
  @Field({ nullable: true })
  p1: boolean;
  @Field({ nullable: true })
  p2: boolean;
  @Field({ nullable: true })
  p3: boolean;
  @Field({ nullable: true })
  p4: boolean;
  @Field({ nullable: true })
  p5: boolean;
  @Field({ nullable: true })
  p6: boolean;
  @Field({ nullable: true })
  p7: boolean;
  @Field({ nullable: true })
  p8: boolean;
  @Field({ nullable: true })
  p9: boolean;
  @Field({ nullable: true })
  p10: boolean;
  @Field({ nullable: true })
  p11: boolean;
  @Field({ nullable: true })
  p12: boolean;
  @Field({ nullable: true })
  p13: boolean;
  @Field({ nullable: true })
  p14: boolean;
  @Field({ nullable: true })
  p15: boolean;
  @Field({ nullable: true })
  p16: boolean;
}

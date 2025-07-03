import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class MenuRegisterInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  readonly label: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  readonly icon: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  readonly routerLink: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  readonly role: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  readonly portal: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  readonly order: number;
}

@InputType()
export class MenuQueryInput {
  @IsString()
  @IsOptional()
  @Field()
  readonly role: string;

  @IsString()
  @IsOptional()
  @Field()
  readonly portal: string;
}

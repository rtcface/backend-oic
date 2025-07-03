import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import e from 'express';

@InputType()
export class UserUpdateColaboradorInput {
  @IsMongoId()
  @Field()
  id: string;

  @IsString()
  @Field()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @Field()
  charge: string;

  @IsString()
  @Field()
  phone: string;
}

@InputType()
export class UserUpdateChangePassword {
  @IsMongoId()
  @Field()
  id: string;

  @IsString()
  @Field()
  password: string;
}

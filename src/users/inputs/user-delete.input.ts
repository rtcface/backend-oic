import { Field, InputType } from "@nestjs/graphql";
import { IsMongoId, IsNotEmpty } from 'class-validator';


@InputType()
export class UserDeleteInput {

    @Field()
    @IsMongoId()
    @IsNotEmpty()
    readonly id: string;
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';



@Module({
  imports: [ MongooseModule.forFeature([{ name: 'User', schema: UserSchema },{ name: 'ComiteUser', schema: UserSchema }]) ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}

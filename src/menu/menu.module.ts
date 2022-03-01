import { Module } from '@nestjs/common';
import { MenuResolver } from './menu.resolver';
import { MenuService } from './menu.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuSchema } from './schemas/menu.schema';

@Module({
  imports: [ MongooseModule.forFeature([{name: 'Menu', schema:MenuSchema}]) ],
  providers: [MenuResolver, MenuService],
  exports: [MenuService]
})
export class MenuModule {}

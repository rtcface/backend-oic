import { Module } from '@nestjs/common';
import { PlanWorkService } from './plan-work.service';
import { PlanWorkResolver } from './plan-work.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanWorkGpSchema } from './schemas';

@Module({
  imports: [ MongooseModule.forFeature([{name: 'PlanWorkGrandParent', schema:PlanWorkGpSchema}]) ],
  providers: [PlanWorkService, PlanWorkResolver],
  exports: [PlanWorkService]
})
export class PlanWorkModule {}

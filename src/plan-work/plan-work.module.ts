import { Module } from '@nestjs/common';
import { PlanWorkService } from './plan-work.service';
import { PlanWorkResolver } from './plan-work.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanWorkGpSchema, PlanWorkPSchema } from './schemas';
import { PlanWorkChSchema } from './schemas/plan-work-ch.schema';

@Module({
  imports: [ 
    MongooseModule.forFeature(
      [
        {
          name: 'PlanWorkGrandParent',
          schema:PlanWorkGpSchema
        },
        {
          name: 'PlanWorkParent',
          schema:PlanWorkPSchema
        },
        {
          name: 'PlanWorkChild',
          schema:PlanWorkChSchema
        }
      ])


   ],
  providers: [PlanWorkService, PlanWorkResolver],
  exports: [PlanWorkService]
})
export class PlanWorkModule {}

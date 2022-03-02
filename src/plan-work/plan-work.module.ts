import { Module } from '@nestjs/common';
import { PlanWorkService } from './plan-work.service';
import { PlanWorkResolver } from './plan-work.resolver';

@Module({
  providers: [PlanWorkService, PlanWorkResolver]
})
export class PlanWorkModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrevencionResolver } from './prevencion.resolver';
import { PrevencionService } from './prevencion.service';
import { ActividadSchema, QuejaSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Actividad', schema: ActividadSchema },
      { name: 'Queja', schema: QuejaSchema },
    ]),
  ],
  providers: [PrevencionResolver, PrevencionService],
  exports: [PrevencionService],
})
export class PrevencionModule {}

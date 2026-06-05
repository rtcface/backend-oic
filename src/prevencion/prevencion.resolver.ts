import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import { PrevencionService } from './prevencion.service';
import { ActividadQueryDto, QuejaQueryDto } from './dto';
import { ActividadRegisterInput, QuejaRegisterInput, EvidenceInput, ActividadUpdateInput, QuejaUpdateInput } from './inputs';

@Resolver()
export class PrevencionResolver {
  constructor(private readonly prevencionService: PrevencionService) {}

  @Query(() => [ActividadQueryDto])
  async getActividades(): Promise<ActividadQueryDto[]> {
    return await this.prevencionService.getActividades();
  }

  @Query(() => [QuejaQueryDto])
  async getQuejas(): Promise<QuejaQueryDto[]> {
    return await this.prevencionService.getQuejas();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ActividadQueryDto)
  async saveActividad(
    @Args('input') input: ActividadRegisterInput,
    @CurrentUser() user: any,
  ): Promise<ActividadQueryDto> {
    const res = await this.prevencionService.saveActividad(input, user.ente_publico);
    const doc = (res as any).toObject ? (res as any).toObject() : res;
    return { ...doc, id: res.id || (res as any)._id?.toString(), success: true };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ActividadQueryDto)
  async addEvidencia(
    @Args('actividadId') actividadId: string,
    @Args('input') input: EvidenceInput,
  ): Promise<ActividadQueryDto> {
    const res = await this.prevencionService.addEvidencia(actividadId, input);
    const doc = (res as any).toObject ? (res as any).toObject() : res;
    return { ...doc, id: res.id || (res as any)._id?.toString(), success: true };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => QuejaQueryDto)
  async saveQueja(
    @Args('input') input: QuejaRegisterInput,
    @CurrentUser() user: any,
  ): Promise<QuejaQueryDto> {
    const res = await this.prevencionService.saveQueja(input, user.ente_publico);
    const doc = (res as any).toObject ? (res as any).toObject() : res;
    return { ...doc, id: res.id || (res as any)._id?.toString(), success: true };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ActividadQueryDto)
  async updateActividad(
    @Args('id') id: string,
    @Args('input') input: ActividadUpdateInput,
  ): Promise<ActividadQueryDto> {
    const res = await this.prevencionService.updateActividad(id, input);
    const doc = (res as any).toObject ? (res as any).toObject() : res;
    return { ...doc, id: res.id || (res as any)._id?.toString(), success: true };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ActividadQueryDto)
  async deleteActividad(
    @Args('id') id: string,
  ): Promise<ActividadQueryDto> {
    const res = await this.prevencionService.deleteActividad(id);
    const doc = (res as any).toObject ? (res as any).toObject() : res;
    return { ...doc, id: res.id || (res as any)._id?.toString(), success: true };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => QuejaQueryDto)
  async updateQueja(
    @Args('id') id: string,
    @Args('input') input: QuejaUpdateInput,
  ): Promise<QuejaQueryDto> {
    const res = await this.prevencionService.updateQueja(id, input);
    const doc = (res as any).toObject ? (res as any).toObject() : res;
    return { ...doc, id: res.id || (res as any)._id?.toString(), success: true };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => QuejaQueryDto)
  async deleteQueja(
    @Args('id') id: string,
  ): Promise<QuejaQueryDto> {
    const res = await this.prevencionService.deleteQueja(id);
    const doc = (res as any).toObject ? (res as any).toObject() : res;
    return { ...doc, id: res.id || (res as any)._id?.toString(), success: true };
  }
}

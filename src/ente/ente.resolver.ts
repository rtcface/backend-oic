import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { EnteService } from './ente.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  EnteDeleteDto,
  EnteQueryDto,
  EnteUpdateDto,
  EnteRegisterDto,
  EnteSeedDto,
} from './dto';
import { EnterRegisterInput, EnteUpdateInput } from './inputs';

@Resolver()
export class EnteResolver {
  constructor(private readonly enteService: EnteService) {}

  //@UseGuards(GqlAuthGuard)
  @Query(() => [EnteQueryDto])
  async getEnte() {
    return await this.enteService.getEnte();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => EnteQueryDto)
  async getEnteById(@Args('id') id: string) {
    return await this.enteService.getEnteById(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => EnteQueryDto)
  async getEnteBySiglas(@Args('siglas') siglas: string) {
    return await this.enteService.getEnteBySiglas(siglas);
  }

  @Query(() => [EnteQueryDto])
  async getEnteByName(@Args('name') name: string) {
    const data = await this.enteService.getEnteByName(name);
    return data ? data : [];
  }

  @Mutation(() => EnteRegisterDto)
  async addEnte(@Args('input') inputAddEnte: EnterRegisterInput) {
    return await this.enteService.addEnte(inputAddEnte);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => [EnteRegisterDto])
  async insertManyEnte(
    @Args({ name: 'data', type: () => [EnterRegisterInput] })
    inputAddEnte: EnterRegisterInput[],
  ) {
    return await this.enteService.cargaMasivaEnte(inputAddEnte);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('admin')
  @Mutation(() => EnteSeedDto)
  async seedEntes() {
    return await this.enteService.seedEntes();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => EnteUpdateDto)
  async updateEnte(
    @Args('id') id: string,
    @Args('input') inputUpdateEnte: EnteUpdateInput,
  ) {
    return await this.enteService.updateEnte(id, inputUpdateEnte);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => EnteDeleteDto)
  async deleteEnte(@Args('id') id: string) {
    return await this.enteService.inactivateEnte(id);
  }
}

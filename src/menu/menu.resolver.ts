import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { MenuService } from './menu.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards';
import { MenuRegisterInput, MenuQueryInput } from './inputs';
import { MenuRegisterdto } from './dto/menu-register.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import * as fs from 'fs';
import * as path from 'path';

@Resolver()
export class MenuResolver {
  constructor(private readonly menuService: MenuService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MenuRegisterdto)
  async addItemMenu(@Args('input') inputAddItemMenu: MenuRegisterInput) {
    return await this.menuService.addItemMenu(inputAddItemMenu);
  }

  @Query(() => [MenuRegisterdto])
  async items(@Args('role') role: string) {
    return await this.menuService.getMenu(role);
  }

  @Query(() => [MenuRegisterdto])
  async getMenuByType(@Args('input') input: MenuQueryInput) {
    return await this.menuService.getMenuByType(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('admin')
  @Mutation(() => Number)
  async seedMenus(): Promise<number> {
    const filePath = path.resolve(
      __dirname,
      '../configuration/data/menus.json',
    );
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const menusData = JSON.parse(fileContent);
    const cleanMenus = (menusData as any[]).map((item) => {
      const { _id, __v, createdAt, updatedAt, ...rest } = item;
      return {
        ...rest,
        createdAt: createdAt?.$date ? new Date(createdAt.$date) : new Date(),
        updatedAt: updatedAt?.$date ? new Date(updatedAt.$date) : new Date(),
      };
    });
    return await this.menuService.seedMenus(cleanMenus);
  }
}

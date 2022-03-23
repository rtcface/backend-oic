import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { MenuService } from './menu.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { MenuRegisterInput } from './inputs';
import { MenuRegisterdto } from './dto/menu-register.dto';

@Resolver()
export class MenuResolver {

    constructor( private readonly menuService: MenuService ) {}

    @UseGuards(GqlAuthGuard)
    @Mutation( () => MenuRegisterdto )
    async addItemMenu(@Args('input') inputAddItemMenu: MenuRegisterInput) {
        return await this.menuService.addItemMenu(inputAddItemMenu);
    }

  

   
    @Query( () => [MenuRegisterdto] )
    async items( @Args('role') role: string ) {
        return await this.menuService.getMenu(role);
    }

  

    

}

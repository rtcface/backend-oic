import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuRegisterdto } from './dto';
import { MenuRegisterInput } from './inputs';

@Injectable()
export class MenuService {
    constructor(
        @InjectModel('Menu') private readonly menuModel: Model<MenuRegisterdto>,
    ) {}

    async addItemMenu(inputCreateMenu: MenuRegisterInput): Promise<MenuRegisterdto> {
        const createdMenu = new this.menuModel(inputCreateMenu);
        return await createdMenu.save();
    }

    async getMenuAdm(): Promise<MenuRegisterdto[]> {
        return await this.menuModel.find()
        .where({status:'active',role:'admin'}).exec();
    }

    async getMenu(): Promise<MenuRegisterdto[]> {
        return await this.menuModel.find()
        .where({status:'active',role:'user'}).exec();
    }
    
}


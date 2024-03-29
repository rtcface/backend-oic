import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuRegisterdto } from './dto';
import { MenuRegisterInput,MenuQueryInput } from './inputs';


@Injectable()
export class MenuService {
    constructor(
        @InjectModel('Menu') private readonly menuModel: Model<MenuRegisterdto>,
    ) {}

    async addItemMenu(inputCreateMenu: MenuRegisterInput): Promise<MenuRegisterdto> {
        const createdMenu = new this.menuModel(inputCreateMenu);
        return await createdMenu.save();
    }    

    async getMenu( role: string ): Promise<MenuRegisterdto[]> {
        return await this.menuModel.find()
        .where({status:'active',role:role}).exec();
    }

    async getMenuByType( mq:MenuQueryInput ): Promise<MenuRegisterdto[]> {
        return await this.menuModel.find()
        .where({status:'active',portal:mq.portal, role:mq.role}).sort({order:1}).exec();
    }
    
}


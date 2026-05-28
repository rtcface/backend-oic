//#region Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  PlanWorkRegisterDto,
  PlanWorkParentRegisterDto,
  PlanWorkChildRegisterDto,
  PlanWorkRegisterDtoOutput,
  PlanWorkParentRegisterDtoOutput,
  PlanWorkChildRegisterDtoOutput,
} from './dto';
import {
  PlanWorkRegisterInput,
  PlanWorkParentRegisterInput,
  PlanWorkChildRegisterInput,
  PlanWorkUpdate,
  PlanWorkParentUpdate,
  PlanWorkQueryInput,
  PlanWorkQueryParentInput,
  PlanWorkChildDeleteInput,
  PlanWorkChildUpdate,
} from './inputs';

//#endregion

/**
 * Service for managing plan work entities and their hierarchy.
 */
@Injectable()
export class PlanWorkService {
  /**
   * Creates an instance of PlanWorkService.
   * @param planWorkModel The grandparent plan work model
   * @param planWorkParentModel The parent plan work model
   * @param planWorkChildModel The child plan work model
   */
  constructor(
    @InjectModel('PlanWorkGrandParent')
    private readonly planWorkModel: Model<PlanWorkRegisterDto>,
    @InjectModel('PlanWorkParent')
    private readonly planWorkParentModel: Model<PlanWorkParentRegisterDto>,
    @InjectModel('PlanWorkChild')
    private readonly planWorkChildModel: Model<PlanWorkChildRegisterDto>,
  ) {}

  //#region Plan Work GrandParent
  /**
   * Adds a new root plan work entity and its default children.
   * @param inputCreatePlanWork The root plan work input
   * @returns The created root plan work entity
   */
  async addPlanWorkRoot(
    inputCreatePlanWork: PlanWorkRegisterInput,
  ): Promise<PlanWorkRegisterDto> {
    try {
      const createdPlanWork = new this.planWorkModel(inputCreatePlanWork);
      const id_root = createdPlanWork._id;
      const save = await createdPlanWork.save();

      for (let i = 0; i <= 6; i++) {
        const parent = {
          IdRoot: id_root!,
          label: `Año ${2019 + i}`,
          data: `Año ${2019 + i}`,
        };
        await this.addPlanWorkParent(parent);
      }

      return save;
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in PlanWorkService',
        error,
      );
    }
  }

  /**
   * Bulk creates root plan work entities.
   * @param inputCreatePlanWork The array of root plan work inputs
   * @returns The created root plan work entities
   */
  async cargaMasivaPlanWorkRoot(
    inputCreatePlanWork: PlanWorkRegisterInput[],
  ): Promise<PlanWorkRegisterDto[]> {
    try {
      const planWork = inputCreatePlanWork.map(
        (planWork) => new this.planWorkModel(planWork),
      );

      if (planWork.length > 0) {
        return await this.planWorkModel.insertMany(planWork);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in PlanWorkService',
        error,
      );
    }
    return [];
  }

  /**
   * Gets all active root plan work entities.
   * @returns An array of root plan work entities
   */
  async getPlanWorkRoot(): Promise<PlanWorkRegisterDto[]> {
    try {
      return await this.planWorkModel.find({ status: 'active' }).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in PlanWorkService',
        error,
      );
    }
  }

  /**
   * Gets a root plan work entity by ID.
   * @param id The root plan work ID
   * @returns The found root plan work entity
   */
  async getPlanWorkRootById(id: string): Promise<PlanWorkRegisterDto> {
    return await this.planWorkModel.findById(id).exec();
  }

  /**
   * Updates a root plan work entity by ID.
   * @param id The root plan work ID
   * @param inputUpdatePlanWork The update input
   * @returns The updated root plan work entity
   */
  async updatePlanWorkRoot(
    id: string,
    inputUpdatePlanWork: PlanWorkRegisterInput,
  ): Promise<PlanWorkRegisterDto> {
    return await this.planWorkModel
      .findByIdAndUpdate(id, inputUpdatePlanWork, { new: true })
      .exec();
  }

  /**
   * Adds a parent to a root plan work entity.
   * @param inputCreatePlanWork The update input
   * @returns The updated root plan work entity
   */
  async addPlanWorkParentInRoot(
    inputCreatePlanWork: PlanWorkUpdate,
  ): Promise<PlanWorkRegisterDto> {
    try {
      return await this.planWorkModel
        .findByIdAndUpdate(
          inputCreatePlanWork.id,
          { $push: { children: inputCreatePlanWork.children } },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in PlanWorkService',
        error,
      );
    }
  }

  /**
   * Inactivates a root plan work entity.
   * @param inactive The delete input
   * @returns The updated root plan work entity
   */
  async inacvitePlanWorkRoot(
    inactive: PlanWorkChildDeleteInput,
  ): Promise<PlanWorkRegisterDto> {
    return await this.planWorkModel
      .findByIdAndUpdate(inactive.id, { status: 'inactive' }, { new: true })
      .exec();
  }

  //#endregion

  //#region Plan Work Parent
  /**
   * Adds a new parent plan work entity.
   * @param inputCreatePlanWork The parent plan work input
   * @returns The created parent plan work entity
   */
  async addPlanWorkParent(
    inputCreatePlanWork: PlanWorkParentRegisterInput,
  ): Promise<PlanWorkParentRegisterDto> {
    try {
      const createdPlanWork = new this.planWorkParentModel(inputCreatePlanWork);

      const planWorkUpdateInRoot: PlanWorkUpdate = {
        id: inputCreatePlanWork.IdRoot,
        children: [createdPlanWork._id],
      };
      await this.addPlanWorkParentInRoot(planWorkUpdateInRoot);
      return await createdPlanWork.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in PlanWorkService',
        error,
      );
    }
  }

  /**
   * Bulk creates parent plan work entities.
   * @param inputCreatePlanWork The array of parent plan work inputs
   * @returns The created parent plan work entities
   */
  async cargaMasivaPlanWorkParent(
    inputCreatePlanWork: PlanWorkParentRegisterInput[],
  ): Promise<PlanWorkParentRegisterDto[]> {
    try {
      const planWork = inputCreatePlanWork.map(
        (planWork) => new this.planWorkParentModel(planWork),
      );

      if (planWork.length > 0) {
        return await this.planWorkParentModel.insertMany(planWork);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in PlanWorkService',
        error,
      );
    }

    return [];
  }

  /**
   * Gets all active parent plan work entities.
   * @returns An array of parent plan work entities
   */
  async getPlanWorkParent(): Promise<PlanWorkParentRegisterDto[]> {
    try {
      return await this.planWorkParentModel.find({ status: 'active' }).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in PlanWorkService',
        error,
      );
    }
  }

  /**
   * Gets a parent plan work entity by ID.
   * @param id The parent plan work ID
   * @returns The found parent plan work entity
   */
  async getPlanWorkParentById(id: string): Promise<PlanWorkParentRegisterDto> {
    try {
      return await this.planWorkParentModel.findById(id).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in PlanWorkService',
        error,
      );
    }
  }

  async updatePlanWorkParent(
    id: string,
    inputUpdatePlanWork: PlanWorkParentRegisterInput,
  ): Promise<PlanWorkParentRegisterDto> {
    try {
      return await this.planWorkParentModel
        .findByIdAndUpdate(id, inputUpdatePlanWork, { new: true })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in PlanWorkService',
        error,
      );
    }
  }

  async inacvitePlanWorkParent(id: string): Promise<PlanWorkParentRegisterDto> {
    try {
      return await this.planWorkParentModel
        .findByIdAndUpdate(id, { status: 'inactive' }, { new: true })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in PlanWorkService',
        error,
      );
    }
  }

  async addPlanWorkChildInParent(
    inputCreatePlanWork: PlanWorkParentUpdate,
  ): Promise<PlanWorkParentRegisterDto> {
    try {
      return await this.planWorkParentModel
        .findByIdAndUpdate(
          inputCreatePlanWork.id,
          { $push: { children: inputCreatePlanWork.children } },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in PlanWorkService',
        error,
      );
    }
  }

  //#endregion

  //#region Plan Work Child
  async addPlanWorkChild(
    inputCreatePlanWork: PlanWorkChildRegisterInput,
  ): Promise<PlanWorkChildRegisterDto> {
    try {
      const createdPlanWork = new this.planWorkChildModel(inputCreatePlanWork);
      const planWorkUpdateInParent: PlanWorkParentUpdate = {
        id: inputCreatePlanWork.IdParent,
        children: [createdPlanWork._id],
      };
      await this.addPlanWorkChildInParent(planWorkUpdateInParent);
      return await createdPlanWork.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in PlanWorkService',
        error,
      );
    }
  }

  async cargaMasivaPlanWorkChild(
    inputCreatePlanWork: PlanWorkChildRegisterInput[],
  ): Promise<PlanWorkChildRegisterDto[]> {
    const planWork = inputCreatePlanWork.map(
      (planWork) => new this.planWorkChildModel(planWork),
    );

    if (planWork.length > 0) {
      return await this.planWorkChildModel.insertMany(planWork);
    }

    return [];
  }

  async getPlanWorkChild(): Promise<PlanWorkChildRegisterDto[]> {
    return await this.planWorkChildModel.find({ status: 'active' }).exec();
  }

  async getPlanWorkChildById(id: string): Promise<PlanWorkChildRegisterDto> {
    return await this.planWorkChildModel.findById(id).exec();
  }

  async updatePlanWorkChild(
    inputUpdatePlanWork: PlanWorkChildUpdate,
  ): Promise<PlanWorkChildRegisterDto> {
    const { id, label, data, url } = inputUpdatePlanWork;

    return await this.planWorkChildModel
      .findByIdAndUpdate(id, { label, data, url }, { new: true })
      .exec();
  }

  async inacvitePlanWorkChild(
    inactive: PlanWorkChildDeleteInput,
  ): Promise<PlanWorkChildRegisterDto> {
    return await this.planWorkChildModel
      .findByIdAndUpdate(inactive.id, { status: 'inactive' }, { new: true })
      .exec();
  }

  //#endregion

  //#region Tree Plan Work
  // get the tree of plan work with populate in planWorkModel, planWorkParentModel, planWorkChildModel
  async getFullTree(
    ente_publico: PlanWorkQueryInput,
  ): Promise<PlanWorkRegisterDtoOutput | []> {
    try {
      const planWork = await this.planWorkModel
        .find({ status: 'active', ente_publico: ente_publico.ente_publico })
        .populate({
          path: 'children',
          model: 'PlanWorkParent',
          match: { status: 'active' },
          populate: {
            path: 'children',
            model: 'PlanWorkChild',
            match: { status: 'active' },
          },
        })
        .exec();

      if (planWork.length > 0) {
        const planWorkRegisterDtoOutput = new PlanWorkRegisterDtoOutput();
        planWorkRegisterDtoOutput.children = [];

        planWork.forEach((element) => {
          planWorkRegisterDtoOutput.id = element._id;
          planWorkRegisterDtoOutput.label = element.label;
          planWorkRegisterDtoOutput.data = element.data;
          planWorkRegisterDtoOutput.expandedIcon = element.expandedIcon;
          planWorkRegisterDtoOutput.collapsedIcon = element.collapsedIcon;
          planWorkRegisterDtoOutput.createdAt = element.createdAt;
          planWorkRegisterDtoOutput.updatedAt = element.updatedAt;
          planWorkRegisterDtoOutput.status = element.status;
          planWorkRegisterDtoOutput.ente_publico = element.ente_publico;

          element.children.forEach((parent_data) => {
            let parent = new PlanWorkParentRegisterDtoOutput();
            parent.children = [];
            const dat: any = parent_data;
            parent.id = dat._id;
            parent.label = dat.label;
            parent.data = dat.data;
            parent.expandedIcon = dat.expandedIcon;
            parent.collapsedIcon = dat.collapsedIcon;
            parent.createdAt = dat.createdAt;
            parent.updatedAt = dat.updatedAt;
            parent.status = dat.status;

            dat.children.map((child) => {
              const child_data_output: PlanWorkChildRegisterDtoOutput =
                new PlanWorkChildRegisterDtoOutput();
              const child_data: any = child;

              child_data_output.id = child_data._id;
              child_data_output.label = child_data.label;
              child_data_output.data = child_data.data;
              child_data_output.icon = child_data.icon;
              child_data_output.createdAt = child_data.createdAt;
              child_data_output.updatedAt = child_data.updatedAt;
              child_data_output.status = child_data.status;
              child_data_output.url = child_data.url;
              parent.children.push(child_data_output);
            });

            planWorkRegisterDtoOutput.children.push(parent);
          });
        });
        return planWorkRegisterDtoOutput;
      } else {
        return [];
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error in PlanWorkService',
        error,
      );
    }
  }

  //#endregion
}

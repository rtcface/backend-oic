import { Test, TestingModule } from '@nestjs/testing';
import { PlanWorkService } from './plan-work.service';
import { getModelToken } from '@nestjs/mongoose';
import { MockMongooseModel } from '../test-utils/mongo-mock';

describe('PlanWorkService', () => {
  let service: PlanWorkService;
  let mockPlanWorkModel: any;
  let mockPlanWorkParentModel: any;

  beforeEach(async () => {
    mockPlanWorkModel = MockMongooseModel();
    mockPlanWorkParentModel = MockMongooseModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanWorkService,
        { provide: getModelToken('PlanWorkGrandParent'), useValue: mockPlanWorkModel },
        { provide: getModelToken('PlanWorkParent'), useValue: mockPlanWorkParentModel },
        { provide: getModelToken('PlanWorkChild'), useValue: MockMongooseModel() },
      ],
    }).compile();

    service = module.get<PlanWorkService>(PlanWorkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPlanWorkRoot', () => {
    it('should return active roots', async () => {
      const mockResult = [{ _id: '1', label: 'Test' }];
      mockPlanWorkModel.exec.mockResolvedValue(mockResult);

      const result = await service.getPlanWorkRoot();
      expect(result).toEqual(mockResult);
      expect(mockPlanWorkModel.find).toHaveBeenCalledWith({ status: 'active' });
    });
  });

  describe('addPlanWorkRoot', () => {
    it('should create root and default children', async () => {
      jest.spyOn(service, 'addPlanWorkParent').mockResolvedValue({} as any);

      const input = { label: 'TestRoot', data: 'DataRoot', ente_publico: 'Ente1' };
      const result = await service.addPlanWorkRoot(input as any);

      expect(result.label).toBe('TestRoot');
      expect(service.addPlanWorkParent).toHaveBeenCalledTimes(7); // from 2019 to 2025 (i=0 to 6)
    });
  });

  describe('addPlanWorkYear', () => {
    it('should format year and call addPlanWorkParent', async () => {
      const mockParent = { _id: '2', label: 'Año 2026', data: 'Año 2026' };
      jest.spyOn(service, 'addPlanWorkParent').mockResolvedValue(mockParent as any);

      const result = await service.addPlanWorkYear('1', 2026);

      expect(result).toEqual(mockParent);
      expect(service.addPlanWorkParent).toHaveBeenCalledWith({
        IdRoot: '1',
        label: 'Año 2026',
        data: 'Año 2026',
      });
    });
  });

  describe('getPlanWorkRootById', () => {
    it('should return a root by id', async () => {
      const mockResult = { _id: '1', label: 'TestRoot' };
      mockPlanWorkModel.findById.mockReturnValue(mockPlanWorkModel);
      mockPlanWorkModel.exec.mockResolvedValue(mockResult);

      const result = await service.getPlanWorkRootById('1');
      expect(result).toEqual(mockResult);
      expect(mockPlanWorkModel.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('updatePlanWorkRoot', () => {
    it('should update a root by id', async () => {
      const mockResult = { _id: '1', label: 'UpdatedRoot' };
      const input = { label: 'UpdatedRoot' };
      mockPlanWorkModel.findByIdAndUpdate.mockReturnValue(mockPlanWorkModel);
      mockPlanWorkModel.exec.mockResolvedValue(mockResult);

      const result = await service.updatePlanWorkRoot('1', input as any);
      expect(result).toEqual(mockResult);
      expect(mockPlanWorkModel.findByIdAndUpdate).toHaveBeenCalledWith('1', input, { new: true });
    });
  });

  describe('inacvitePlanWorkRoot', () => {
    it('should inactivate a root', async () => {
      const mockResult = { _id: '1', status: 'inactive' };
      mockPlanWorkModel.findByIdAndUpdate.mockReturnValue(mockPlanWorkModel);
      mockPlanWorkModel.exec.mockResolvedValue(mockResult);

      const result = await service.inacvitePlanWorkRoot({ id: '1' } as any);
      expect(result).toEqual(mockResult);
      expect(mockPlanWorkModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { status: 'inactive' }, { new: true });
    });
  });

  describe('getFullTree', () => {
    it('should return empty array if no plan work is found', async () => {
      mockPlanWorkModel.exec.mockResolvedValue([]);

      const result = await service.getFullTree({ ente_publico: 'Ente1' });
      expect(result).toEqual([]);
    });

    it('should return structured tree if plan works exist', async () => {
      const mockData = [
        {
          _id: '1',
          label: 'Root',
          data: 'RootData',
          ente_publico: 'Ente1',
          children: [
            {
              _id: '11',
              label: 'Parent',
              data: 'ParentData',
              children: [
                {
                  _id: '111',
                  label: 'Child',
                  data: 'ChildData',
                },
              ],
            },
          ],
        },
      ];
      mockPlanWorkModel.exec.mockResolvedValue(mockData);

      const result = await service.getFullTree({ ente_publico: 'Ente1' }) as any;
      expect(result.id).toBe('1');
      expect(result.label).toBe('Root');
      expect(result.children[0].id).toBe('11');
      expect(result.children[0].label).toBe('Parent');
      expect(result.children[0].children[0].id).toBe('111');
      expect(result.children[0].children[0].label).toBe('Child');
    });
  });
});

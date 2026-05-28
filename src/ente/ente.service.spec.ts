import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EnteService } from './ente.service';
import { PlanWorkService } from '../plan-work/plan-work.service';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs and path modules
jest.mock('fs');
jest.mock('path');

describe('EnteService', () => {
  let service: EnteService;
  let enteModel: Model<any>;
  let planWorkService: PlanWorkService;

  const mockEnteModel = {
    new: jest.fn(),
    save: jest.fn(),
    insertMany: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOne: jest.fn(),
    countDocuments: jest.fn(),
    exec: jest.fn(),
  };

  // Mock constructor function
  const MockEnteModel = jest.fn().mockImplementation((data) => {
    return {
      ...data,
      _id: 'test-id',
      save: jest.fn().mockResolvedValue({ ...data, _id: 'test-id' }),
    };
  });

  // Assign the mock methods to the constructor
  Object.assign(MockEnteModel, mockEnteModel);

  const mockPlanWorkService = {
    addPlanWorkRoot: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnteService,
        {
          provide: getModelToken('EntePublico'),
          useValue: MockEnteModel,
        },
        {
          provide: PlanWorkService,
          useValue: mockPlanWorkService,
        },
      ],
    }).compile();

    service = module.get<EnteService>(EnteService);
    enteModel = module.get<Model<any>>(getModelToken('EntePublico'));
    planWorkService = module.get<PlanWorkService>(PlanWorkService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    MockEnteModel.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addEnte', () => {
    it('should create a new ente and plan work', async () => {
      const inputCreateEnte = {
        nombre_ente: 'Test Ente',
        siglas_ente: 'TE',
        status: 'active',
      };

      const mockEnte = {
        _id: 'test-id',
        ...inputCreateEnte,
      };

      const mockSavedEnte = {
        ...mockEnte,
        save: jest.fn().mockResolvedValue(mockEnte),
      };

      MockEnteModel.mockReturnValue(mockSavedEnte);
      mockPlanWorkService.addPlanWorkRoot.mockResolvedValue({});

      const result = await service.addEnte(inputCreateEnte);

      expect(MockEnteModel).toHaveBeenCalledWith(inputCreateEnte);
      expect(mockSavedEnte.save).toHaveBeenCalled();
      expect(mockPlanWorkService.addPlanWorkRoot).toHaveBeenCalledWith({
        ente_publico: 'test-id',
        label: 'Plan de trabajo',
        data: 'Plan de trabajo',
      });
      expect(result).toEqual(mockEnte);
    });
  });

  describe('cargaMasivaEnte', () => {
    it('should insert multiple entes', async () => {
      const inputCreateEntes = [
        {
          nombre_ente: 'Test Ente 1',
          siglas_ente: 'TE1',
          status: 'active',
        },
        {
          nombre_ente: 'Test Ente 2',
          siglas_ente: 'TE2',
          status: 'active',
        },
      ];

      const mockEntes = inputCreateEntes.map((ente, index) => ({
        ...ente,
        _id: `test-id-${index}`,
      }));

      MockEnteModel.mockImplementation((data) => ({
        ...data,
        _id: `test-id-${mockEntes.findIndex(
          (ente) => ente.nombre_ente === data.nombre_ente,
        )}`,
      }));

      mockEnteModel.insertMany.mockResolvedValue(mockEntes);

      const result = await service.cargaMasivaEnte(inputCreateEntes);

      expect(mockEnteModel.insertMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining(inputCreateEntes[0]),
          expect.objectContaining(inputCreateEntes[1]),
        ]),
      );
      expect(result).toEqual(mockEntes);
    });

    it('should return empty array when no entes provided', async () => {
      const result = await service.cargaMasivaEnte([]);
      expect(result).toEqual([]);
      expect(mockEnteModel.insertMany).not.toHaveBeenCalled();
    });
  });

  describe('seedEntes', () => {
    const mockJsonData = [
      {
        nombre_ente: 'Test Ente 1',
        siglas_ente: 'TE1',
        status: 'active',
        createdAt: { $date: '2022-04-05T18:45:18.026Z' },
        updatedAt: { $date: '2022-04-05T18:45:18.043Z' },
      },
      {
        nombre_ente: 'Test Ente 2',
        siglas_ente: 'TE2',
        status: 'active',
        createdAt: { $date: '2022-04-05T19:04:37.104Z' },
        updatedAt: { $date: '2022-04-05T19:04:37.104Z' },
      },
    ];

    beforeEach(() => {
      (path.join as jest.Mock).mockReturnValue(
        '/mock/path/oic.entepublicos.json',
      );
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockJsonData),
      );
    });

    it('should seed entes successfully when database is empty', async () => {
      const mockInsertedEntes = mockJsonData.map((ente, index) => ({
        ...ente,
        _id: `test-id-${index}`,
      }));

      mockEnteModel.countDocuments.mockResolvedValue(0);
      mockEnteModel.insertMany.mockResolvedValue(mockInsertedEntes);

      const result = await service.seedEntes();

      expect(fs.readFileSync).toHaveBeenCalledWith(
        '/mock/path/oic.entepublicos.json',
        'utf8',
      );
      expect(mockEnteModel.countDocuments).toHaveBeenCalled();
      expect(mockEnteModel.insertMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            nombre_ente: 'Test Ente 1',
            siglas_ente: 'TE1',
            status: 'active',
          }),
          expect.objectContaining({
            nombre_ente: 'Test Ente 2',
            siglas_ente: 'TE2',
            status: 'active',
          }),
        ]),
      );
      expect(result).toEqual({
        message: 'Successfully seeded 2 entes into the database.',
        count: 2,
      });
    });

    it('should skip seeding when database already contains data', async () => {
      mockEnteModel.countDocuments.mockResolvedValue(5);

      const result = await service.seedEntes();

      expect(mockEnteModel.countDocuments).toHaveBeenCalled();
      expect(mockEnteModel.insertMany).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Database already contains 5 entes. Skipping seed operation.',
        count: 5,
      });
    });

    it('should handle missing status field', async () => {
      const mockJsonDataWithoutStatus = [
        {
          nombre_ente: 'Test Ente',
          siglas_ente: 'TE',
          createdAt: { $date: '2022-04-05T18:45:18.026Z' },
          updatedAt: { $date: '2022-04-05T18:45:18.043Z' },
        },
      ];

      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockJsonDataWithoutStatus),
      );
      mockEnteModel.countDocuments.mockResolvedValue(0);
      mockEnteModel.insertMany.mockResolvedValue([
        { ...mockJsonDataWithoutStatus[0], _id: 'test-id' },
      ]);

      const result = await service.seedEntes();

      expect(mockEnteModel.insertMany).toHaveBeenCalledWith([
        expect.objectContaining({
          nombre_ente: 'Test Ente',
          siglas_ente: 'TE',
          status: 'active', // Default status
        }),
      ]);
      expect(result.count).toBe(1);
    });

    it('should handle file read errors', async () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });

      await expect(service.seedEntes()).rejects.toThrow(
        'Failed to seed entes: File not found',
      );
    });

    it('should handle JSON parse errors', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');

      await expect(service.seedEntes()).rejects.toThrow(
        'Failed to seed entes:',
      );
    });
  });

  describe('getEnte', () => {
    it('should return active entes', async () => {
      const mockEntes = [
        {
          _id: '1',
          nombre_ente: 'Ente 1',
          siglas_ente: 'E1',
          status: 'active',
        },
        {
          _id: '2',
          nombre_ente: 'Ente 2',
          siglas_ente: 'E2',
          status: 'active',
        },
      ];

      const mockFind = {
        exec: jest.fn().mockResolvedValue(mockEntes),
      };

      mockEnteModel.find.mockReturnValue(mockFind);

      const result = await service.getEnte();

      expect(mockEnteModel.find).toHaveBeenCalledWith({ status: 'active' });
      expect(mockFind.exec).toHaveBeenCalled();
      expect(result).toEqual(mockEntes);
    });
  });

  describe('getEnteById', () => {
    it('should return ente by id', async () => {
      const mockEnte = {
        _id: 'test-id',
        nombre_ente: 'Test Ente',
        siglas_ente: 'TE',
      };
      const mockFindById = {
        exec: jest.fn().mockResolvedValue(mockEnte),
      };

      mockEnteModel.findById.mockReturnValue(mockFindById);

      const result = await service.getEnteById('test-id');

      expect(mockEnteModel.findById).toHaveBeenCalledWith('test-id');
      expect(mockFindById.exec).toHaveBeenCalled();
      expect(result).toEqual(mockEnte);
    });
  });

  describe('updateEnte', () => {
    it('should update ente', async () => {
      const updateInput = {
        id: 'test-id',
        nombre_ente: 'Updated Ente',
        siglas_ente: 'UE',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
      };
      const mockUpdatedEnte = { _id: 'test-id', ...updateInput };
      const mockFindByIdAndUpdate = {
        exec: jest.fn().mockResolvedValue(mockUpdatedEnte),
      };

      mockEnteModel.findByIdAndUpdate.mockReturnValue(mockFindByIdAndUpdate);

      const result = await service.updateEnte('test-id', updateInput);

      expect(mockEnteModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'test-id',
        updateInput,
        { new: true },
      );
      expect(mockFindByIdAndUpdate.exec).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedEnte);
    });
  });

  describe('inactivateEnte', () => {
    it('should inactivate ente', async () => {
      const mockInactivatedEnte = { _id: 'test-id', status: 'inactive' };
      const mockFindByIdAndUpdate = {
        exec: jest.fn().mockResolvedValue(mockInactivatedEnte),
      };

      mockEnteModel.findByIdAndUpdate.mockReturnValue(mockFindByIdAndUpdate);

      const result = await service.inactivateEnte('test-id');

      expect(mockEnteModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'test-id',
        { status: 'inactive' },
        { new: true },
      );
      /*  expect(mockFindByIdAndUpdate.exec).toHaveBeenCalled();
      expect(result).toEqual(mockInactivatedEnte); */
    });
  });

  describe('getEnteBySiglas', () => {
    it('should return ente by siglas', async () => {
      const mockEnte = {
        _id: 'test-id',
        nombre_ente: 'Test Ente',
        siglas_ente: 'TE',
      };
      const mockFindOne = {
        exec: jest.fn().mockResolvedValue(mockEnte),
      };

      mockEnteModel.findOne.mockReturnValue(mockFindOne);

      const result = await service.getEnteBySiglas('TE');

      expect(mockEnteModel.findOne).toHaveBeenCalledWith({ siglas: 'TE' });
      expect(mockFindOne.exec).toHaveBeenCalled();
      expect(result).toEqual(mockEnte);
    });
  });

  describe('getEnteByName', () => {
    it('should return entes by name search', async () => {
      const mockEntes = [
        {
          _id: '1',
          nombre_ente: 'Test Ente 1',
          siglas_ente: 'TE1',
          status: 'active',
        },
        {
          _id: '2',
          nombre_ente: 'Test Ente 2',
          siglas_ente: 'TE2',
          status: 'active',
        },
      ];
      const mockFind = {
        exec: jest.fn().mockResolvedValue(mockEntes),
      };

      mockEnteModel.find.mockReturnValue(mockFind);

      const result = await service.getEnteByName('Test');

      expect(mockEnteModel.find).toHaveBeenCalledWith({
        $or: [{ nombre_ente: /Test/i }, { siglas_ente: /Test/i }],
        $and: [{ status: 'active' }],
      });
      expect(mockFind.exec).toHaveBeenCalled();
      expect(result).toEqual(mockEntes);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { EnteResolver } from './ente.resolver';
import { EnteService } from './ente.service';

describe('EnteResolver', () => {
  let resolver: EnteResolver;
  let enteService: EnteService;

  const mockEnteService = {
    getEnte: jest.fn(),
    getEnteById: jest.fn(),
    getEnteBySiglas: jest.fn(),
    getEnteByName: jest.fn(),
    addEnte: jest.fn(),
    cargaMasivaEnte: jest.fn(),
    seedEntes: jest.fn(),
    updateEnte: jest.fn(),
    inactivateEnte: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnteResolver,
        {
          provide: EnteService,
          useValue: mockEnteService,
        },
      ],
    }).compile();

    resolver = module.get<EnteResolver>(EnteResolver);
    enteService = module.get<EnteService>(EnteService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getEnte', () => {
    it('should return all active entes', async () => {
      const mockEntes = [
        { id: '1', nombre_ente: 'Ente 1', siglas_ente: 'E1' },
        { id: '2', nombre_ente: 'Ente 2', siglas_ente: 'E2' },
      ];

      mockEnteService.getEnte.mockResolvedValue(mockEntes);

      const result = await resolver.getEnte();

      expect(mockEnteService.getEnte).toHaveBeenCalled();
      expect(result).toEqual(mockEntes);
    });
  });

  describe('getEnteById', () => {
    it('should return ente by id', async () => {
      const mockEnte = {
        id: 'test-id',
        nombre_ente: 'Test Ente',
        siglas_ente: 'TE',
      };

      mockEnteService.getEnteById.mockResolvedValue(mockEnte);

      const result = await resolver.getEnteById('test-id');

      expect(mockEnteService.getEnteById).toHaveBeenCalledWith('test-id');
      expect(result).toEqual(mockEnte);
    });
  });

  describe('getEnteBySiglas', () => {
    it('should return ente by siglas', async () => {
      const mockEnte = {
        id: 'test-id',
        nombre_ente: 'Test Ente',
        siglas_ente: 'TE',
      };

      mockEnteService.getEnteBySiglas.mockResolvedValue(mockEnte);

      const result = await resolver.getEnteBySiglas('TE');

      expect(mockEnteService.getEnteBySiglas).toHaveBeenCalledWith('TE');
      expect(result).toEqual(mockEnte);
    });
  });

  describe('getEnteByName', () => {
    it('should return entes by name search', async () => {
      const mockEntes = [
        { id: '1', nombre_ente: 'Test Ente 1', siglas_ente: 'TE1' },
        { id: '2', nombre_ente: 'Test Ente 2', siglas_ente: 'TE2' },
      ];

      mockEnteService.getEnteByName.mockResolvedValue(mockEntes);

      const result = await resolver.getEnteByName('Test');

      expect(mockEnteService.getEnteByName).toHaveBeenCalledWith('Test');
      expect(result).toEqual(mockEntes);
    });

    it('should return empty array when no results found', async () => {
      mockEnteService.getEnteByName.mockResolvedValue(null);

      const result = await resolver.getEnteByName('NonExistent');

      expect(mockEnteService.getEnteByName).toHaveBeenCalledWith('NonExistent');
      expect(result).toEqual([]);
    });
  });

  describe('addEnte', () => {
    it('should create a new ente', async () => {
      const inputAddEnte = {
        nombre_ente: 'New Ente',
        siglas_ente: 'NE',
        status: 'active',
      };

      const mockCreatedEnte = { id: 'new-id', ...inputAddEnte };

      mockEnteService.addEnte.mockResolvedValue(mockCreatedEnte);

      const result = await resolver.addEnte(inputAddEnte);

      expect(mockEnteService.addEnte).toHaveBeenCalledWith(inputAddEnte);
      expect(result).toEqual(mockCreatedEnte);
    });
  });

  describe('insertManyEnte', () => {
    it('should insert multiple entes', async () => {
      const inputAddEntes = [
        {
          nombre_ente: 'Ente 1',
          siglas_ente: 'E1',
          status: 'active',
        },
        {
          nombre_ente: 'Ente 2',
          siglas_ente: 'E2',
          status: 'active',
        },
      ];

      const mockCreatedEntes = inputAddEntes.map((ente, index) => ({
        id: `id-${index}`,
        ...ente,
      }));

      mockEnteService.cargaMasivaEnte.mockResolvedValue(mockCreatedEntes);

      const result = await resolver.insertManyEnte(inputAddEntes);

      expect(mockEnteService.cargaMasivaEnte).toHaveBeenCalledWith(
        inputAddEntes,
      );
      expect(result).toEqual(mockCreatedEntes);
    });
  });

  describe('seedEntes', () => {
    it('should seed entes successfully', async () => {
      const mockSeedResult = {
        message: 'Successfully seeded 50 entes into the database.',
        count: 50,
      };

      mockEnteService.seedEntes.mockResolvedValue(mockSeedResult);

      const result = await resolver.seedEntes();

      expect(mockEnteService.seedEntes).toHaveBeenCalled();
      expect(result).toEqual(mockSeedResult);
    });

    it('should handle seed when database already contains data', async () => {
      const mockSeedResult = {
        message: 'Database already contains 25 entes. Skipping seed operation.',
        count: 25,
      };

      mockEnteService.seedEntes.mockResolvedValue(mockSeedResult);

      const result = await resolver.seedEntes();

      expect(mockEnteService.seedEntes).toHaveBeenCalled();
      expect(result).toEqual(mockSeedResult);
    });

    it('should handle seed errors', async () => {
      const errorMessage = 'Failed to seed entes: File not found';
      mockEnteService.seedEntes.mockRejectedValue(new Error(errorMessage));

      await expect(resolver.seedEntes()).rejects.toThrow(errorMessage);
      expect(mockEnteService.seedEntes).toHaveBeenCalled();
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
      const mockUpdatedEnte = { id: 'test-id', ...updateInput };

      mockEnteService.updateEnte.mockResolvedValue(mockUpdatedEnte);

      const result = await resolver.updateEnte('test-id', updateInput);

      expect(mockEnteService.updateEnte).toHaveBeenCalledWith(
        'test-id',
        updateInput,
      );
      expect(result).toEqual(mockUpdatedEnte);
    });
  });

  describe('deleteEnte', () => {
    it('should inactivate ente', async () => {
      const mockInactivatedEnte = { id: 'test-id', status: 'inactive' };

      mockEnteService.inactivateEnte.mockResolvedValue(mockInactivatedEnte);

      const result = await resolver.deleteEnte('test-id');

      expect(mockEnteService.inactivateEnte).toHaveBeenCalledWith('test-id');
      expect(result).toEqual(mockInactivatedEnte);
    });
  });
});

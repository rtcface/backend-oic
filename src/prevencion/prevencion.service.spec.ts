import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PrevencionService } from './prevencion.service';

describe('PrevencionService', () => {
  let service: PrevencionService;
  let mockActividadModel: any;
  let mockQuejaModel: any;

  beforeEach(async () => {
    const createMockModel = () => {
      const mockMethods = {
        find: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        findByIdAndUpdate: jest.fn().mockReturnThis(),
        exec: jest.fn(),
      };

      const constructorMock = jest.fn().mockImplementation((data) => {
        return {
          ...data,
          id: 'mock-id',
          _id: 'mock-id',
          save: jest.fn().mockImplementation(async () => {
            return {
              ...data,
              id: 'mock-id',
              _id: 'mock-id',
              populate: jest.fn().mockImplementation(async (field: string) => {
                return {
                  ...data,
                  id: 'mock-id',
                  _id: 'mock-id',
                  ente_publico: {
                    id: data.ente_publico,
                    _id: data.ente_publico,
                    nombre_ente: 'Mocked Ente',
                  },
                };
              }),
            };
          }),
        };
      });

      Object.assign(constructorMock, mockMethods);
      return constructorMock;
    };

    mockActividadModel = createMockModel();
    mockQuejaModel = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrevencionService,
        {
          provide: getModelToken('Actividad'),
          useValue: mockActividadModel,
        },
        {
          provide: getModelToken('Queja'),
          useValue: mockQuejaModel,
        },
      ],
    }).compile();

    service = module.get<PrevencionService>(PrevencionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveActividad', () => {
    it('should create and return saved Actividad with populated ente_publico', async () => {
      const input = {
        titulo: 'Actividad de Prueba',
        evidencias: [{ titulo: 'Documento 1', archivo: 'http://test.com/doc.pdf' }],
      };
      const entePublicoId = 'ente-id-123';

      const result = await service.saveActividad(input as any, entePublicoId);

      expect(mockActividadModel).toHaveBeenCalledWith({
        ...input,
        ente_publico: entePublicoId,
      });
      expect(result).toBeDefined();
      expect(result.id).toBe('mock-id');
      expect(result.titulo).toBe(input.titulo);
      expect((result.ente_publico as any).id).toBe(entePublicoId);
      expect((result.ente_publico as any).nombre_ente).toBe('Mocked Ente');
    });
  });

  describe('saveQueja', () => {
    it('should create and return saved Queja with populated ente_publico', async () => {
      const input = {
        procedentes: 10,
        improcedentes: 5,
      };
      const entePublicoId = 'ente-id-456';

      const result = await service.saveQueja(input as any, entePublicoId);

      expect(mockQuejaModel).toHaveBeenCalledWith({
        ...input,
        ente_publico: entePublicoId,
      });
      expect(result).toBeDefined();
      expect(result.id).toBe('mock-id');
      expect(result.procedentes).toBe(input.procedentes);
      expect((result.ente_publico as any).id).toBe(entePublicoId);
      expect((result.ente_publico as any).nombre_ente).toBe('Mocked Ente');
    });
  });

  describe('getActividades', () => {
    it('should return a list of active activities', async () => {
      const mockResult = [
        {
          id: 'act-1',
          titulo: 'Actividad 1',
          status: 'active',
          ente_publico: { id: 'ente-1', nombre_ente: 'Ente 1' },
        },
      ];

      mockActividadModel.exec.mockResolvedValue(mockResult);

      const result = await service.getActividades();

      expect(mockActividadModel.find).toHaveBeenCalledWith({ status: 'active' });
      expect(mockActividadModel.populate).toHaveBeenCalledWith('ente_publico');
      expect(result).toEqual(mockResult);
    });
  });

  describe('getQuejas', () => {
    it('should return a list of active complaints', async () => {
      const mockResult = [
        {
          id: 'queja-1',
          procedentes: 5,
          improcedentes: 2,
          status: 'active',
          ente_publico: { id: 'ente-1', nombre_ente: 'Ente 1' },
        },
      ];

      mockQuejaModel.exec.mockResolvedValue(mockResult);

      const result = await service.getQuejas();

      expect(mockQuejaModel.find).toHaveBeenCalledWith({ status: 'active' });
      expect(mockQuejaModel.populate).toHaveBeenCalledWith('ente_publico');
      expect(result).toEqual(mockResult);
    });
  });

  describe('addEvidencia', () => {
    it('should push evidence to specified activity and return the updated activity', async () => {
      const activityId = 'act-123';
      const input = {
        titulo: 'Evidencia 1',
        archivo: 'base64str',
      };
      const mockResult = {
        id: 'act-123',
        titulo: 'Actividad 1',
        ente_publico: { id: 'ente-1', nombre_ente: 'Ente 1' },
        evidencias: [input],
      };

      mockActividadModel.findByIdAndUpdate.mockReturnThis();
      mockActividadModel.populate.mockResolvedValue(mockResult);

      const result = await service.addEvidencia(activityId, input);

      expect(mockActividadModel.findByIdAndUpdate).toHaveBeenCalledWith(
        activityId,
        { $push: { evidencias: input } },
        { new: true },
      );
      expect(mockActividadModel.populate).toHaveBeenCalledWith('ente_publico');
      expect(result).toEqual(mockResult);
    });
  });
});

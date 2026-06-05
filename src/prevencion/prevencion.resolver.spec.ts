import { Test, TestingModule } from '@nestjs/testing';
import { PrevencionResolver } from './prevencion.resolver';
import { PrevencionService } from './prevencion.service';

describe('PrevencionResolver', () => {
  let resolver: PrevencionResolver;
  let service: PrevencionService;

  const mockPrevencionService = {
    getActividades: jest.fn(),
    getQuejas: jest.fn(),
    saveActividad: jest.fn(),
    saveQueja: jest.fn(),
    addEvidencia: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrevencionResolver,
        {
          provide: PrevencionService,
          useValue: mockPrevencionService,
        },
      ],
    }).compile();

    resolver = module.get<PrevencionResolver>(PrevencionResolver);
    service = module.get<PrevencionService>(PrevencionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getActividades', () => {
    it('should return activities from service', async () => {
      const mockResult = [
        {
          _id: 'act-1',
          titulo: 'Actividad 1',
          ente_publico: { _id: 'ente-1', nombre_ente: 'Ente 1' },
        },
      ];
      mockPrevencionService.getActividades.mockResolvedValue(mockResult);

      const result = await resolver.getActividades();

      expect(mockPrevencionService.getActividades).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('getQuejas', () => {
    it('should return complaints from service', async () => {
      const mockResult = [
        {
          _id: 'queja-1',
          procedentes: 10,
          improcedentes: 2,
          ente_publico: { _id: 'ente-1', nombre_ente: 'Ente 1' },
        },
      ];
      mockPrevencionService.getQuejas.mockResolvedValue(mockResult);

      const result = await resolver.getQuejas();

      expect(mockPrevencionService.getQuejas).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('saveActividad', () => {
    it('should call service with input and user.ente_publico, and return result with success: true', async () => {
      const input = {
        titulo: 'Actividad de Prueba',
        evidencias: [{ titulo: 'Documento 1', archivo: 'http://test.com/doc.pdf' }],
      };
      const mockUser = {
        _id: 'user-id-123',
        ente_publico: 'ente-id-123',
      };
      const mockServiceResult = {
        _id: 'act-new',
        titulo: 'Actividad de Prueba',
        ente_publico: 'ente-id-123',
        toObject: jest.fn().mockReturnValue({
          _id: 'act-new',
          titulo: 'Actividad de Prueba',
          ente_publico: 'ente-id-123',
        }),
      };

      mockPrevencionService.saveActividad.mockResolvedValue(mockServiceResult);

      const result = await resolver.saveActividad(input as any, mockUser);

      expect(mockPrevencionService.saveActividad).toHaveBeenCalledWith(input, mockUser.ente_publico);
      expect(result).toEqual({
        _id: 'act-new',
        id: 'act-new',
        titulo: 'Actividad de Prueba',
        ente_publico: 'ente-id-123',
        success: true,
      });
    });

    it('should handle service result without toObject method', async () => {
      const input = {
        titulo: 'Actividad de Prueba',
        evidencias: [],
      };
      const mockUser = {
        _id: 'user-id-123',
        ente_publico: 'ente-id-123',
      };
      const mockServiceResult = {
        _id: 'act-new',
        titulo: 'Actividad de Prueba',
        ente_publico: 'ente-id-123',
      };

      mockPrevencionService.saveActividad.mockResolvedValue(mockServiceResult);

      const result = await resolver.saveActividad(input as any, mockUser);

      expect(mockPrevencionService.saveActividad).toHaveBeenCalledWith(input, mockUser.ente_publico);
      expect(result).toEqual({
        _id: 'act-new',
        id: 'act-new',
        titulo: 'Actividad de Prueba',
        ente_publico: 'ente-id-123',
        success: true,
      });
    });
  });

  describe('saveQueja', () => {
    it('should call service with input and user.ente_publico, and return result with success: true', async () => {
      const input = {
        procedentes: 15,
        improcedentes: 3,
      };
      const mockUser = {
        _id: 'user-id-456',
        ente_publico: 'ente-id-456',
      };
      const mockServiceResult = {
        _id: 'queja-new',
        procedentes: 15,
        improcedentes: 3,
        ente_publico: 'ente-id-456',
        toObject: jest.fn().mockReturnValue({
          _id: 'queja-new',
          procedentes: 15,
          improcedentes: 3,
          ente_publico: 'ente-id-456',
        }),
      };

      mockPrevencionService.saveQueja.mockResolvedValue(mockServiceResult);

      const result = await resolver.saveQueja(input as any, mockUser);

      expect(mockPrevencionService.saveQueja).toHaveBeenCalledWith(input, mockUser.ente_publico);
      expect(result).toEqual({
        _id: 'queja-new',
        id: 'queja-new',
        procedentes: 15,
        improcedentes: 3,
        ente_publico: 'ente-id-456',
        success: true,
      });
    });

    it('should handle service result without toObject method', async () => {
      const input = {
        procedentes: 15,
        improcedentes: 3,
      };
      const mockUser = {
        _id: 'user-id-456',
        ente_publico: 'ente-id-456',
      };
      const mockServiceResult = {
        _id: 'queja-new',
        procedentes: 15,
        improcedentes: 3,
        ente_publico: 'ente-id-456',
      };

      mockPrevencionService.saveQueja.mockResolvedValue(mockServiceResult);

      const result = await resolver.saveQueja(input as any, mockUser);

      expect(mockPrevencionService.saveQueja).toHaveBeenCalledWith(input, mockUser.ente_publico);
      expect(result).toEqual({
        _id: 'queja-new',
        id: 'queja-new',
        procedentes: 15,
        improcedentes: 3,
        ente_publico: 'ente-id-456',
        success: true,
      });
    });
  });

  describe('addEvidencia', () => {
    it('should call service with activity ID and input, returning result with success: true', async () => {
      const activityId = 'act-123';
      const input = {
        titulo: 'Evidencia 1',
        archivo: 'base64str',
      };
      const mockServiceResult = {
        _id: 'act-123',
        titulo: 'Actividad 1',
        toObject: jest.fn().mockReturnValue({
          _id: 'act-123',
          titulo: 'Actividad 1',
        }),
      };

      mockPrevencionService.addEvidencia.mockResolvedValue(mockServiceResult);

      const result = await resolver.addEvidencia(activityId, input as any);

      expect(mockPrevencionService.addEvidencia).toHaveBeenCalledWith(activityId, input);
      expect(result).toEqual({
        _id: 'act-123',
        id: 'act-123',
        titulo: 'Actividad 1',
        success: true,
      });
    });
  });
});

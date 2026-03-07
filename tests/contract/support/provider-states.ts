/**
 * Provider State Factories for gmao-hiansa
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Provider states for Pact contract testing
 */

import { pactConfig } from './pact-config';

export const providerStates = {
  /**
   * Provider state: Usuario autenticado
   */
  usuarioAutenticado: {
    description: 'Usuario autenticado en el sistema',
    params: {
      userId: 'user-123',
      email: 'test@example.com',
      capabilities: ['can_view_kanban'],
    },
  },

  /**
   * Provider state: Existen OTs en el sistema
   */
  otsExistentes: {
    description: 'Órdenes de trabajo disponibles en el sistema',
    params: {
      ots: [
        {
          id: 'ot-123',
          estado: 'Pendiente',
          tipo_mantenimiento: 'Correctivo',
          prioridad: 'Media',
        },
      ],
    },
  },

  /**
   * Provider state: Existen activos disponibles
   */
  activosDisponibles: {
    description: 'Activos registrados en el sistema',
    params: {
      activos: [
        {
          id: 'asset-123',
          nombre: 'Perfiladora-P201',
          planta: 'Planta Acero Perfilado',
          linea: 'Línea 1',
          tipo: 'Perfiladora',
          estado: 'Operativo',
        },
      ],
    },
  },

  /**
   * Provider state: Usuario con permiso para crear averías
   */
  usuarioConPermisoReportarAverias: {
    description: 'Usuario con capability can_create_failure_report',
    params: {
      userId: 'user-456',
      capabilities: ['can_create_failure_report'],
    },
  },

  /**
   * Provider state: Stock de repuestos actualizado
   */
  stockRepuestosActualizado: {
    description: 'Stock de repuestos en tiempo real',
    params: {
      repuestos: [
        {
          codigo: 'ROD-6208',
          nombre: 'Rodamiento SKF-6208',
          stock: 10,
          stock_minimo: 5,
          ubicacion: 'Estante A-15',
        },
      ],
    },
  },

  /**
   * Helper: Get provider state by name
   */
  getProviderState(stateName: string) {
    return providerStates[stateName as keyof typeof providerStates] || null;
  },
};

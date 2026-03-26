// prisma/seed.ts
// GMAO HiRock/Ultra - Seed Data para Desarrollo
// Story 0.2: Database Schema con Jerarquía 5 Niveles

/* eslint-disable no-console */
// Console logs are acceptable in seed files for progress tracking

import { PrismaClient, Division, EquipoEstado } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Limpiar database existente (con cuidado en producción!)
  console.log('🧹 Cleaning existing data...')
  await prisma.workOrderAssignment.deleteMany()
  await prisma.failureReport.deleteMany()
  await prisma.workOrder.deleteMany()
  await prisma.equipoComponente.deleteMany()
  await prisma.repuesto.deleteMany()
  await prisma.componente.deleteMany()
  await prisma.equipo.deleteMany()
  await prisma.linea.deleteMany()
  await prisma.planta.deleteMany()
  await prisma.userCapability.deleteMany()
  await prisma.capability.deleteMany()
  await prisma.user.deleteMany()

  // ============================================
  // 1. CREAR CAPABILITIES (15 capacidades PBAC)
  // ============================================
  console.log('📋 Creating capabilities...')

  await prisma.capability.createMany({
    data: [
      { name: 'can_create_failure_report', label: 'Crear Reporte de Avería', description: 'Permite crear reportes de avería' },
      { name: 'can_create_manual_ot', label: 'Crear OT Manual', description: 'Permite crear órdenes de trabajo manuales' },
      { name: 'can_update_own_ot', label: 'Actualizar Mis OTs', description: 'Permite actualizar OTs asignadas' },
      { name: 'can_view_own_ots', label: 'Ver Mis OTs', description: 'Permite ver OTs asignadas' },
      { name: 'can_view_all_ots', label: 'Ver Todas las OTs', description: 'Permite ver todas las órdenes de trabajo' },
      { name: 'can_complete_ot', label: 'Completar OTs', description: 'Permite completar órdenes de trabajo' },
      { name: 'can_manage_stock', label: 'Gestionar Stock', description: 'Permite gestionar repuestos y stock' },
      { name: 'can_assign_technicians', label: 'Asignar Técnicos', description: 'Permite asignar técnicos a OTs' },
      { name: 'can_view_kpis', label: 'Ver KPIs', description: 'Permite ver indicadores de rendimiento' },
      { name: 'can_manage_assets', label: 'Gestionar Activos', description: 'Permite gestionar equipos y componentes' },
      { name: 'can_view_repair_history', label: 'Ver Historial', description: 'Permite ver historial de reparaciones' },
      { name: 'can_manage_providers', label: 'Gestionar Proveedores', description: 'Permite gestionar proveedores externos' },
      { name: 'can_manage_routines', label: 'Gestionar Rutinas', description: 'Permite gestionar rutinas preventivas' },
      { name: 'can_manage_users', label: 'Gestionar Usuarios', description: 'Permite gestionar usuarios del sistema' },
      { name: 'can_receive_reports', label: 'Recibir Reportes', description: 'Permite recibir notificaciones de averías' },
    ],
  })

  console.log('✅ Created 15 capabilities')

  // Obtener todas las capabilities para asignarlas al admin
  const allCapabilities = await prisma.capability.findMany()

  // ============================================
  // 2. CREAR USUARIOS
  // ============================================
  console.log('👥 Creating users...')

  // Admin con todas las capabilities
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@hiansa.com',
      passwordHash: adminPassword,
      name: 'Administrador',
      phone: '+34 600 000 001',
      forcePasswordReset: false,
    },
  })

  // Asignar todas las capabilities al admin
  console.log('🔐 Assigning capabilities to admin...')
  console.log('   Admin ID:', admin.id)
  console.log('   Capabilities to assign:', allCapabilities.length)

  const adminCaps = await prisma.userCapability.createMany({
    data: allCapabilities.map((cap) => ({
      userId: admin.id,
      capabilityId: cap.id,
    })),
  })

  console.log('   ✅ Assigned', adminCaps.count, 'capabilities to admin')

  // Usuario: B. Soto (Operario - solo puede crear reportes)
  const bsotoPassword = await bcrypt.hash('1112BSC08', 10)
  const bsoto = await prisma.user.create({
    data: {
      email: 'bsoto@hiansa.com',
      passwordHash: bsotoPassword,
      name: 'B. Soto',
      phone: '+34 600 000 010',
      forcePasswordReset: false,
    },
  })

  // Asignar solo capabilities de operario a B. Soto
  const operarioCapabilities = allCapabilities.filter((cap) => cap.name === 'can_create_failure_report')
  await prisma.userCapability.createMany({
    data: operarioCapabilities.map((cap) => ({
      userId: bsoto.id,
      capabilityId: cap.id,
    })),
  })

  // Usuario: Técnico con capacidades limitadas
  const tecnicoPassword = await bcrypt.hash('tecnico123', 10)
  const tecnico = await prisma.user.create({
    data: {
      email: 'tecnico@hiansa.com',
      passwordHash: tecnicoPassword,
      name: 'Carlos Tecnico',
      phone: '+34 600 000 002',
      forcePasswordReset: false,
    },
  })

  // Capabilities del técnico
  const tecnicoCapabilities = allCapabilities.filter((cap) =>
    ['can_create_failure_report', 'can_update_own_ot', 'can_view_own_ots', 'can_complete_ot'].includes(
      cap.name
    )
  )
  await prisma.userCapability.createMany({
    data: tecnicoCapabilities.map((cap) => ({
      userId: tecnico.id,
      capabilityId: cap.id,
    })),
  })

  // Usuario: Supervisor con capacidades de gestión
  const supervisorPassword = await bcrypt.hash('supervisor123', 10)
  const supervisor = await prisma.user.create({
    data: {
      email: 'supervisor@hiansa.com',
      passwordHash: supervisorPassword,
      name: 'Maria Supervisor',
      phone: '+34 600 000 003',
      forcePasswordReset: false,
    },
  })

  // Capabilities del supervisor
  const supervisorCapabilities = allCapabilities.filter((cap) =>
    [
      'can_view_all_ots',
      'can_assign_technicians',
      'can_view_kpis',
      'can_view_repair_history',
      'can_receive_reports',
    ].includes(cap.name)
  )
  await prisma.userCapability.createMany({
    data: supervisorCapabilities.map((cap) => ({
      userId: supervisor.id,
      capabilityId: cap.id,
    })),
  })

  // Usuario: Nuevo usuario con forcePasswordReset=true (para E2E tests de Story 1.1)
  const newUserPassword = await bcrypt.hash('tempPassword123', 10)
  const newUser = await prisma.user.create({
    data: {
      email: 'new.user@example.com',
      passwordHash: newUserPassword,
      name: 'Nuevo Usuario',
      phone: '+34 600 000 004',
      forcePasswordReset: true,
    },
  })

  // Capabilities del nuevo usuario (solo can_create_failure_report por defecto - NFR-S66)
  const newUserCapabilities = allCapabilities.filter((cap) =>
    cap.name === 'can_create_failure_report'
  )
  await prisma.userCapability.createMany({
    data: newUserCapabilities.map((cap) => ({
      userId: newUser.id,
      capabilityId: cap.id,
    })),
  })

  console.log('✅ Created 5 users (admin, bsoto, tecnico, supervisor, new user with forcePasswordReset=true)')

  // ============================================
  // Story 1.3: CREAR ETIQUETAS DE CLASIFICACIÓN
  // ============================================
  console.log('🏷️  Creating classification tags...')

  const tags = await prisma.tag.createMany({
    data: [
      {
        name: 'Operario',
        color: '#3B82F6', // Blue
        description: 'Personal de operaciones básicas',
      },
      {
        name: 'Técnico',
        color: '#10B981', // Green
        description: 'Personal técnico especializado',
      },
      {
        name: 'Supervisor',
        color: '#F59E0B', // Amber
        description: 'Personal de supervisión',
      },
      {
        name: 'Mantenimiento',
        color: '#EF4444', // Red
        description: 'Equipo de mantenimiento',
      },
      {
        name: 'Calidad',
        color: '#8B5CF6', // Purple
        description: 'Personal de control de calidad',
      },
    ],
    skipDuplicates: true, // Avoid errors when tags already exist
  })

  console.log(`✅ Created ${tags.count} classification tags`)

  // ============================================
  // 3. CREAR JERARQUÍA DE 5 NIVELES
  // ============================================
  console.log('🏭 Creating 5-level hierarchy...')

  // Nivel 1: Plantas (2 plantas - 1 HiRock, 1 Ultra)
  const plantaHiRock = await prisma.planta.create({
    data: {
      name: 'Planta HiRock Madrid',
      code: 'HIROCK-MAD-01',
      division: Division.HIROCK,
    },
  })

  const plantaUltra = await prisma.planta.create({
    data: {
      name: 'Planta Ultra Barcelona',
      code: 'ULTRA-BCN-01',
      division: Division.ULTRA,
    },
  })

  // Nivel 2: Lineas (5 lineas distribuidas)
  await prisma.linea.createMany({
    data: [
      { name: 'Linea de Produccion A', code: 'LINEA-A', planta_id: plantaHiRock.id },
      { name: 'Linea de Produccion B', code: 'LINEA-B', planta_id: plantaHiRock.id },
      { name: 'Linea de Ensamblaje', code: 'LINEA-C', planta_id: plantaHiRock.id },
      { name: 'Linea de Procesamiento X', code: 'LINEA-X', planta_id: plantaUltra.id },
      { name: 'Linea de Procesamiento Y', code: 'LINEA-Y', planta_id: plantaUltra.id },
    ],
  })

  const allLineas = await prisma.linea.findMany()

  // Nivel 3: Equipos (10 equipos distribuidos)
  await prisma.equipo.createMany({
    data: [
      // Planta HiRock - Línea A
      {
        name: 'Prensa Hidraulica PH-01',
        code: 'EQ-PH-01',
        linea_id: allLineas[0].id,
        estado: EquipoEstado.OPERATIVO,
        ubicacion_actual: 'Zona Norte - Linea A',
      },
      {
        name: 'Torno CNC TC-01',
        code: 'EQ-TC-01',
        linea_id: allLineas[0].id,
        estado: EquipoEstado.OPERATIVO,
        ubicacion_actual: 'Zona Norte - Linea A',
      },
      // Planta HiRock - Línea B
      {
        name: 'Compresor CP-01',
        code: 'EQ-CP-01',
        linea_id: allLineas[1].id,
        estado: EquipoEstado.AVERIADO,
        ubicacion_actual: 'Zona Sur - Linea B',
      },
      {
        name: 'Transportadora TR-01',
        code: 'EQ-TR-01',
        linea_id: allLineas[1].id,
        estado: EquipoEstado.OPERATIVO,
        ubicacion_actual: 'Zona Sur - Linea B',
      },
      // Planta HiRock - Línea C
      {
        name: 'Robot Industrial RB-01',
        code: 'EQ-RB-01',
        linea_id: allLineas[2].id,
        estado: EquipoEstado.OPERATIVO,
        ubicacion_actual: 'Zona Este - Linea C',
      },
      {
        name: 'Brazo Mecanico BM-01',
        code: 'EQ-BM-01',
        linea_id: allLineas[2].id,
        estado: EquipoEstado.OPERATIVO,
        ubicacion_actual: 'Zona Este - Linea C',
      },
      // Planta Ultra - Línea X
      {
        name: 'Mezcladora MZ-01',
        code: 'EQ-MZ-01',
        linea_id: allLineas[3].id,
        estado: EquipoEstado.OPERATIVO,
        ubicacion_actual: 'Zona Oeste - Linea X',
      },
      {
        name: 'Horno HR-01',
        code: 'EQ-HR-01',
        linea_id: allLineas[3].id,
        estado: EquipoEstado.EN_REPARACION,
        ubicacion_actual: 'Zona Oeste - Linea X',
      },
      // Planta Ultra - Línea Y
      {
        name: 'Empacadora EM-01',
        code: 'EQ-EM-01',
        linea_id: allLineas[4].id,
        estado: EquipoEstado.OPERATIVO,
        ubicacion_actual: 'Zona Centro - Linea Y',
      },
      {
        name: 'Selladora SR-01',
        code: 'EQ-SR-01',
        linea_id: allLineas[4].id,
        estado: EquipoEstado.OPERATIVO,
        ubicacion_actual: 'Zona Centro - Linea Y',
      },
    ],
  })

  const allEquipos = await prisma.equipo.findMany()

  // Nivel 4: Componentes (algunos componentes para equipos)
  await prisma.componente.createMany({
    data: [
      { name: 'Motor Electrico 5HP', code: 'COMP-ME-5HP' },
      { name: 'Bomba Hidraulica', code: 'COMP-BH-001' },
      { name: 'Sensor de Temperatura', code: 'COMP-ST-001' },
      { name: 'Rodamiento SKF-6002', code: 'COMP-RB-6002' },
      { name: 'Correa de Transmision', code: 'COMP-CT-001' },
      { name: 'Panel de Control PLC', code: 'COMP-PC-PLC' },
      { name: 'Cilindro Neumatico', code: 'COMP-CN-001' },
      { name: 'Filtro de Aire', code: 'COMP-FA-001' },
    ],
  })

  const allComponentes = await prisma.componente.findMany()

  // Relación muchos-a-muchos Equipo-Componente
  await prisma.equipoComponente.createMany({
    data: [
      // Componentes para Prensa Hidraulica
      { equipo_id: allEquipos[0].id, componente_id: allComponentes[1].id }, // Bomba Hidraulica
      { equipo_id: allEquipos[0].id, componente_id: allComponentes[5].id }, // Panel de Control
      // Componentes para Torno CNC
      { equipo_id: allEquipos[1].id, componente_id: allComponentes[0].id }, // Motor Electrico
      { equipo_id: allEquipos[1].id, componente_id: allComponentes[3].id }, // Rodamiento
      // Componentes para Compresor
      { equipo_id: allEquipos[2].id, componente_id: allComponentes[0].id }, // Motor Electrico
      { equipo_id: allEquipos[2].id, componente_id: allComponentes[7].id }, // Filtro de Aire
      // Componentes para Robot
      { equipo_id: allEquipos[4].id, componente_id: allComponentes[5].id }, // Panel de Control
      { equipo_id: allEquipos[4].id, componente_id: allComponentes[6].id }, // Cilindro Neumatico
    ],
  })

  // Nivel 5: Repuestos (algunos repuestos para componentes)
  await prisma.repuesto.createMany({
    data: [
      {
        name: 'Motor Electrico 5HP (Repuesto)',
        code: 'REP-ME-5HP-01',
        componente_id: allComponentes[0].id,
        stock: 50,
        stock_minimo: 5,
        ubicacion_fisica: 'Almacen A - Estante 1',
      },
      {
        name: 'Bomba Hidraulica (Repuesto)',
        code: 'REP-BH-001-01',
        componente_id: allComponentes[1].id,
        stock: 50,
        stock_minimo: 5,
        ubicacion_fisica: 'Almacen A - Estante 2',
      },
      {
        name: 'Rodamiento SKF-6002 (Repuesto)',
        code: 'REP-RB-6002-01',
        componente_id: allComponentes[3].id,
        stock: 100,
        stock_minimo: 10,
        ubicacion_fisica: 'Almacen B - Estante 3',
      },
      {
        name: 'Correa de Transmision (Repuesto)',
        code: 'REP-CT-001-01',
        componente_id: allComponentes[4].id,
        stock: 75,
        stock_minimo: 10,
        ubicacion_fisica: 'Almacen B - Estante 4',
      },
      {
        name: 'Filtro de Aire (Repuesto)',
        code: 'REP-FA-001-01',
        componente_id: allComponentes[7].id,
        stock: 60,
        stock_minimo: 10,
        ubicacion_fisica: 'Almacen A - Estante 5',
      },
    ],
  })

  console.log('✅ Created 5-level hierarchy:')
  console.log('   - 2 Plantas (HiRock, Ultra)')
  console.log('   - 5 Lineas distribuidas')
  console.log('   - 10 Equipos de ejemplo')
  console.log('   - 8 Componentes')
  console.log('   - 5 Repuestos')

  // ============================================
  // 4. CREAR ALGUNOS EJEMPLOS DE OPERACIONES
  // ============================================
  console.log('📝 Creating sample operations...')

  // Crear WorkOrders de ejemplo en diferentes estados para Story 3.1 (Kanban)
  // Seed ampliado con muchas OTs para E2E testing - evita que los tests se afecten entre sí

  // PENDIENTE (5 OTs)
  const workOrder1 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-001',
      tipo: 'CORRECTIVO',
      estado: 'PENDIENTE',
      descripcion: 'Revisión de Transportadora - Mantenimiento Preventivo',
      equipo_id: allEquipos[3].id,
    },
  })

  const workOrder6 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-006',
      tipo: 'PREVENTIVO',
      estado: 'PENDIENTE',
      descripcion: 'Inspección de Bomba Hidráulica',
      equipo_id: allEquipos[6].id,
    },
  })

  const workOrder7 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-007',
      tipo: 'CORRECTIVO',
      estado: 'PENDIENTE',
      descripcion: 'Revisión de Sistema Eléctrico',
      equipo_id: allEquipos[7].id,
    },
  })

  const workOrder8 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-008',
      tipo: 'PREVENTIVO',
      estado: 'PENDIENTE',
      descripcion: 'Mantenimiento de Compresor de Aire',
      equipo_id: allEquipos[8].id,
    },
  })

  const workOrder9 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-009',
      tipo: 'CORRECTIVO',
      estado: 'PENDIENTE',
      descripcion: 'Ajuste de Rodillos Transportadora',
      equipo_id: allEquipos[9].id,
    },
  })

  // ASIGNADA (5 OTs)
  const workOrder2 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-002',
      tipo: 'PREVENTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Cambio de aceite en Torno CNC',
      equipo_id: allEquipos[1].id,
    },
  })

  const workOrder10 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-010',
      tipo: 'CORRECTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Reparación de Sensor de Proximidad',
      equipo_id: allEquipos[0].id,
    },
  })

  const workOrder11 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-011',
      tipo: 'PREVENTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Calibración de Instrumentos',
      equipo_id: allEquipos[3].id,
    },
  })

  const workOrder12 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-012',
      tipo: 'CORRECTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Reemplazo de Filtros de Aire',
      equipo_id: allEquipos[5].id,
    },
  })

  const workOrder13 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-013',
      tipo: 'PREVENTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Lubricación de Rodamientos',
      equipo_id: allEquipos[7].id,
    },
  })

  // Additional ASIGNADA OTs for E2E testing (10 more)
  const workOrder100 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-100',
      tipo: 'CORRECTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Reparación de Sistema Hidráulico',
      equipo_id: allEquipos[0].id,
    },
  })

  const workOrder101 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-101',
      tipo: 'PREVENTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Mantenimiento de Tablero Eléctrico',
      equipo_id: allEquipos[1].id,
    },
  })

  const workOrder102 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-102',
      tipo: 'CORRECTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Cambio de Filtros Hidráulicos',
      equipo_id: allEquipos[2].id,
    },
  })

  const workOrder103 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-103',
      tipo: 'PREVENTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Inspección de Rodamientos',
      equipo_id: allEquipos[3].id,
    },
  })

  const workOrder104 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-104',
      tipo: 'CORRECTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Reemplazo de Correas',
      equipo_id: allEquipos[4].id,
    },
  })

  const workOrder105 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-105',
      tipo: 'PREVENTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Limpieza de Intercambiador de Calor',
      equipo_id: allEquipos[5].id,
    },
  })

  const workOrder106 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-106',
      tipo: 'CORRECTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Ajuste de Tensión de Cadena',
      equipo_id: allEquipos[6].id,
    },
  })

  const workOrder107 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-107',
      tipo: 'PREVENTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Calibración de Sensores',
      equipo_id: allEquipos[7].id,
    },
  })

  const workOrder108 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-108',
      tipo: 'CORRECTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Reparación de Válvula Solenoide',
      equipo_id: allEquipos[8].id,
    },
  })

  const workOrder109 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-109',
      tipo: 'PREVENTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Mantenimiento de Sistema de Refrigeración',
      equipo_id: allEquipos[9].id,
    },
  })

  // Additional ASIGNADA OTs for E2E testing (15 more to prevent parallel test contention)
  const workOrder150 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-150',
      tipo: 'CORRECTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Reparación de Sistema Hidráulico',
      equipo_id: allEquipos[0].id,
    },
  })

  const workOrder151 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-151',
      tipo: 'PREVENTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Lubricación de Rodamientos',
      equipo_id: allEquipos[1].id,
    },
  })

  const workOrder152 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-152',
      tipo: 'CORRECTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Cambio de Filtros de Aire',
      equipo_id: allEquipos[2].id,
    },
  })

  const workOrder153 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-153',
      tipo: 'PREVENTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Inspección de Bandas Transportadoras',
      equipo_id: allEquipos[3].id,
    },
  })

  const workOrder154 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-154',
      tipo: 'CORRECTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Reemplazo de Sensores de Proximidad',
      equipo_id: allEquipos[4].id,
    },
  })

  const workOrder155 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-155',
      tipo: 'PREVENTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Ajuste de Tensiones Eléctricas',
      equipo_id: allEquipos[5].id,
    },
  })

  const workOrder156 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-156',
      tipo: 'CORRECTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Reparación de Compresor de Aire',
      equipo_id: allEquipos[6].id,
    },
  })

  const workOrder157 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-157',
      tipo: 'PREVENTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Calibración de Instrumentos de Medición',
      equipo_id: allEquipos[7].id,
    },
  })

  const workOrder158 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-158',
      tipo: 'CORRECTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Mantenimiento de Tablero Eléctrico',
      equipo_id: allEquipos[8].id,
    },
  })

  const workOrder159 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-159',
      tipo: 'PREVENTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Limpieza de Condensadores',
      equipo_id: allEquipos[9].id,
    },
  })

  const workOrder160 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-160',
      tipo: 'CORRECTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Reemplazo de Fusibles',
      equipo_id: allEquipos[0].id,
    },
  })

  const workOrder161 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-161',
      tipo: 'PREVENTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Inspección de Motores Eléctricos',
      equipo_id: allEquipos[1].id,
    },
  })

  const workOrder162 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-162',
      tipo: 'CORRECTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Reparación de Válvulas de Control',
      equipo_id: allEquipos[2].id,
    },
  })

  const workOrder163 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-163',
      tipo: 'PREVENTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Alineación de Poleas',
      equipo_id: allEquipos[3].id,
    },
  })

  const workOrder164 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-164',
      tipo: 'CORRECTIVO',
      estado: 'ASIGNADA',
      descripcion: 'Mantenimiento de Sistema Neumático',
      equipo_id: allEquipos[4].id,
    },
  })

  // EN_PROGRESO (5 OTs)
  const workOrder3 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-003',
      tipo: 'CORRECTIVO',
      estado: 'EN_PROGRESO',
      descripcion: 'Reparacion de Compresor CP-01 - Reemplazar rodamiento',
      equipo_id: allEquipos[2].id,
    },
  })

  const workOrder3b = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-003b',
      tipo: 'CORRECTIVO',
      estado: 'EN_PROGRESO',
      descripcion: 'Mantenimiento de Robot Industrial - Revisión programada',
      equipo_id: allEquipos[5].id,
    },
  })

  const workOrder14 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-014',
      tipo: 'PREVENTIVO',
      estado: 'EN_PROGRESO',
      descripcion: 'Alineación de Ejes Motor',
      equipo_id: allEquipos[4].id,
    },
  })

  const workOrder15 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-015',
      tipo: 'CORRECTIVO',
      estado: 'EN_PROGRESO',
      descripcion: 'Reparación de Control Lógico PLC',
      equipo_id: allEquipos[6].id,
    },
  })

  const workOrder16 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-016',
      tipo: 'PREVENTIVO',
      estado: 'EN_PROGRESO',
      descripcion: 'Balanceo de Turbina',
      equipo_id: allEquipos[8].id,
    },
  })

  // Additional EN_PROGRESO OTs for E2E testing (10 more)
  const workOrder110 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-110',
      tipo: 'CORRECTIVO',
      estado: 'EN_PROGRESO',
      descripcion: 'Reparación de Sistema Neumático',
      equipo_id: allEquipos[0].id,
    },
  })

  const workOrder111 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-111',
      tipo: 'PREVENTIVO',
      estado: 'EN_PROGRESO',
      descripcion: 'Ajuste de Poleas y Correas',
      equipo_id: allEquipos[1].id,
    },
  })

  const workOrder112 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-112',
      tipo: 'CORRECTIVO',
      estado: 'EN_PROGRESO',
      descripcion: 'Cambio de Aceite de Motor',
      equipo_id: allEquipos[2].id,
    },
  })

  const workOrder113 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-113',
      tipo: 'PREVENTIVO',
      estado: 'EN_PROGRESO',
      descripcion: 'Inspección de Sistema Eléctrico',
      equipo_id: allEquipos[3].id,
    },
  })

  const workOrder114 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-114',
      tipo: 'CORRECTIVO',
      estado: 'EN_PROGRESO',
      descripcion: 'Reemplazo de Junta Térmica',
      equipo_id: allEquipos[4].id,
    },
  })

  const workOrder115 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-115',
      tipo: 'PREVENTIVO',
      estado: 'EN_PROGRESO',
      descripcion: 'Limpieza de Condensador',
      equipo_id: allEquipos[5].id,
    },
  })

  const workOrder116 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-116',
      tipo: 'CORRECTIVO',
      estado: 'EN_PROGRESO',
      descripcion: 'Alineación de Acoplamientos',
      equipo_id: allEquipos[6].id,
    },
  })

  const workOrder117 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-117',
      tipo: 'PREVENTIVO',
      estado: 'EN_PROGRESO',
      descripcion: 'Calibración de Instrumentos de Medición',
      equipo_id: allEquipos[7].id,
    },
  })

  const workOrder118 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-118',
      tipo: 'CORRECTIVO',
      estado: 'EN_PROGRESO',
      descripcion: 'Reparación de Bomba Hidráulica',
      equipo_id: allEquipos[8].id,
    },
  })

  const workOrder119 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-119',
      tipo: 'PREVENTIVO',
      estado: 'EN_PROGRESO',
      descripcion: 'Mantenimiento de Sistema de Ventilación',
      equipo_id: allEquipos[9].id,
    },
  })

  // PENDIENTE_REPUESTO (4 OTs)
  const workOrder4 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-004',
      tipo: 'PREVENTIVO',
      estado: 'PENDIENTE_REPUESTO',
      descripcion: 'Cambio de filtros en Prensa Hidráulica',
      equipo_id: allEquipos[0].id,
    },
  })

  const workOrder17 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-017',
      tipo: 'CORRECTIVO',
      estado: 'PENDIENTE_REPUESTO',
      descripcion: 'Reemplazo de Rodamiento Dañado',
      equipo_id: allEquipos[1].id,
    },
  })

  const workOrder18 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-018',
      tipo: 'PREVENTIVO',
      estado: 'PENDIENTE_REPUESTO',
      descripcion: 'Cambio de Correa Trapecial',
      equipo_id: allEquipos[2].id,
    },
  })

  const workOrder19 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-019',
      tipo: 'CORRECTIVO',
      estado: 'PENDIENTE_REPUESTO',
      descripcion: 'Reemplazo de Sensor de Temperatura',
      equipo_id: allEquipos[9].id,
    },
  })

  // PENDIENTE_PARADA (3 OTs)
  const workOrder20 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-020',
      tipo: 'CORRECTIVO',
      estado: 'PENDIENTE_PARADA',
      descripcion: 'Reparación Mayor de Motor Principal',
      equipo_id: allEquipos[4].id,
    },
  })

  const workOrder21 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-021',
      tipo: 'PREVENTIVO',
      estado: 'PENDIENTE_PARADA',
      descripcion: 'Overhaul de Compresor',
      equipo_id: allEquipos[2].id,
    },
  })

  const workOrder22 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-022',
      tipo: 'CORRECTIVO',
      estado: 'PENDIENTE_PARADA',
      descripcion: 'Reemplazo de Sistema de Transmisión',
      equipo_id: allEquipos[6].id,
    },
  })

  // REPARACION_EXTERNA (3 OTs)
  const workOrder23 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-023',
      tipo: 'CORRECTIVO',
      estado: 'REPARACION_EXTERNA',
      descripcion: 'Envío de Motor para Reparación Externa',
      equipo_id: allEquipos[4].id,
    },
  })

  const workOrder24 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-024',
      tipo: 'PREVENTIVO',
      estado: 'REPARACION_EXTERNA',
      descripcion: 'Calibración Externa de Instrumentos',
      equipo_id: allEquipos[7].id,
    },
  })

  const workOrder25 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-025',
      tipo: 'CORRECTIVO',
      estado: 'REPARACION_EXTERNA',
      descripcion: 'Reconstrucción de Bomba Hidráulica',
      equipo_id: allEquipos[0].id,
    },
  })

  // COMPLETADA (5 OTs)
  const workOrder5 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-005',
      tipo: 'CORRECTIVO',
      estado: 'COMPLETADA',
      descripcion: 'Reparación de Motor Eléctrico - Finalizado',
      equipo_id: allEquipos[4].id,
      completed_at: new Date(),
    },
  })

  const workOrder26 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-026',
      tipo: 'PREVENTIVO',
      estado: 'COMPLETADA',
      descripcion: 'Mantenimiento Completo de Torno',
      equipo_id: allEquipos[1].id,
      completed_at: new Date(),
    },
  })

  const workOrder27 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-027',
      tipo: 'CORRECTIVO',
      estado: 'COMPLETADA',
      descripcion: 'Reparación de Sistema Hidráulico',
      equipo_id: allEquipos[0].id,
      completed_at: new Date(),
    },
  })

  const workOrder28 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-028',
      tipo: 'PREVENTIVO',
      estado: 'COMPLETADA',
      descripcion: 'Inspección de Robot Industrial',
      equipo_id: allEquipos[5].id,
      completed_at: new Date(),
    },
  })

  const workOrder29 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-029',
      tipo: 'CORRECTIVO',
      estado: 'COMPLETADA',
      descripcion: 'Ajuste de Controladores',
      equipo_id: allEquipos[8].id,
      completed_at: new Date(),
    },
  })

  // DESCARTADA (2 OTs)
  const workOrder30 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-030',
      tipo: 'CORRECTIVO',
      estado: 'DESCARTADA',
      descripcion: 'Cancelada - Equipo reemplazado',
      equipo_id: allEquipos[3].id,
    },
  })

  const workOrder31 = await prisma.workOrder.create({
    data: {
      numero: 'OT-2025-031',
      tipo: 'PREVENTIVO',
      estado: 'DESCARTADA',
      descripcion: 'Cancelada - No necesaria',
      equipo_id: allEquipos[6].id,
    },
  })

  // Total: 57 WorkOrders (5+15+15+4+3+3+5+2 = 52, + workOrders 1-5 = 57)

  // Asignar técnicos a las OTs
  await prisma.workOrderAssignment.create({
    data: {
      work_order_id: workOrder3.id,
      userId: tecnico.id,
      role: 'TECNICO',
    },
  })

  await prisma.workOrderAssignment.create({
    data: {
      work_order_id: workOrder2.id,
      userId: tecnico.id,
      role: 'TECNICO',
    },
  })

  // Asignar técnico a más OTs ASIGNADA para tests E2E
  await prisma.workOrderAssignment.create({
    data: {
      work_order_id: workOrder10.id,
      userId: tecnico.id,
      role: 'TECNICO',
    },
  })

  await prisma.workOrderAssignment.create({
    data: {
      work_order_id: workOrder11.id,
      userId: tecnico.id,
      role: 'TECNICO',
    },
  })

  await prisma.workOrderAssignment.create({
    data: {
      work_order_id: workOrder12.id,
      userId: tecnico.id,
      role: 'TECNICO',
    },
  })

  await prisma.workOrderAssignment.create({
    data: {
      work_order_id: workOrder13.id,
      userId: tecnico.id,
      role: 'TECNICO',
    },
  })

  // Assign additional ASIGNADA OTs (100-109) to technician
  for (const wo of [workOrder100, workOrder101, workOrder102, workOrder103, workOrder104,
                     workOrder105, workOrder106, workOrder107, workOrder108, workOrder109]) {
    await prisma.workOrderAssignment.create({
      data: {
        work_order_id: wo.id,
        userId: tecnico.id,
        role: 'TECNICO',
      },
    })
  }

  // Assign additional ASIGNADA OTs (150-164) to technician for E2E testing
  for (const wo of [workOrder150, workOrder151, workOrder152, workOrder153, workOrder154,
                     workOrder155, workOrder156, workOrder157, workOrder158, workOrder159,
                     workOrder160, workOrder161, workOrder162, workOrder163, workOrder164]) {
    await prisma.workOrderAssignment.create({
      data: {
        work_order_id: wo.id,
        userId: tecnico.id,
        role: 'TECNICO',
      },
    })
  }

  // Assign additional EN_PROGRESO OTs (110-119) to technician
  for (const wo of [workOrder110, workOrder111, workOrder112, workOrder113, workOrder114,
                     workOrder115, workOrder116, workOrder117, workOrder118, workOrder119]) {
    await prisma.workOrderAssignment.create({
      data: {
        work_order_id: wo.id,
        userId: tecnico.id,
        role: 'TECNICO',
      },
    })
  }

  // ============================================
  // ADDITIONAL EN_PROGRESO OTs FOR E2E TESTS (120-149)
  // Created to ensure enough test data when tests run in parallel
  // Each test needs its own EN_PROGRESO OT to avoid conflicts
  // ============================================
  const additionalEnProgresoOTs = []
  for (let i = 120; i <= 149; i++) {
    const wo = await prisma.workOrder.create({
      data: {
        numero: `OT-2025-${i}`,
        tipo: i % 2 === 0 ? 'CORRECTIVO' : 'PREVENTIVO',
        estado: 'EN_PROGRESO',
        descripcion: `OT de prueba para E2E testing - #${i}`,
        equipo_id: allEquipos[i % 10].id,
      },
    })
    additionalEnProgresoOTs.push(wo)
  }

  // Assign all additional EN_PROGRESO OTs to technician
  for (const wo of additionalEnProgresoOTs) {
    await prisma.workOrderAssignment.create({
      data: {
        work_order_id: wo.id,
        userId: tecnico.id,
        role: 'TECNICO',
      },
    })
  }

  // ============================================
  // ASSIGN OTs TO ADMIN USER for E2E testing
  // Assign admin to some ASIGNADA and EN_PROGRESO OTs
  // This allows tests running as admin to see OTs in "Mis OTs"
  // ============================================

  // Assign admin to ASIGNADA OTs (100-104)
  for (const wo of [workOrder100, workOrder101, workOrder102, workOrder103, workOrder104]) {
    await prisma.workOrderAssignment.create({
      data: {
        work_order_id: wo.id,
        userId: admin.id,
        role: 'TECNICO',
      },
    })
  }

  // Assign admin to EN_PROGRESO OTs (110-114 and 120-124)
  for (const wo of [workOrder110, workOrder111, workOrder112, workOrder113, workOrder114]) {
    await prisma.workOrderAssignment.create({
      data: {
        work_order_id: wo.id,
        userId: admin.id,
        role: 'TECNICO',
      },
    })
  }

  // Assign admin to additional EN_PROGRESO OTs (120-124)
  for (let i = 120; i <= 124; i++) {
    const wo = additionalEnProgresoOTs.find(w => w.numero === `OT-2025-${i}`)
    if (wo) {
      await prisma.workOrderAssignment.create({
        data: {
          work_order_id: wo.id,
          userId: admin.id,
          role: 'TECNICO',
        },
      })
    }
  }

  // Crear FailureReports de ejemplo con estado NUEVO (para Story 2.3 - Triage)
  const failureReport1 = await prisma.failureReport.create({
    data: {
      numero: 'AV-2026-001',
      descripcion: 'Compresor haciendo ruido excesivo y vibracion anormal',
      tipo: 'avería', // NFR-S10: avería
      fotoUrl: null,
      equipoId: allEquipos[2].id, // Compresor
      estado: 'NUEVO',
      reportadoPor: tecnico.id,
    },
  })

  const failureReport2 = await prisma.failureReport.create({
    data: {
      numero: 'AV-2026-002',
      descripcion: 'Torno CNC presenta errores de posicionamiento en eje X',
      tipo: 'avería', // NFR-S10: avería
      fotoUrl: null,
      equipoId: allEquipos[1].id, // Torno CNC
      estado: 'NUEVO',
      reportadoPor: tecnico.id,
    },
  })

  const failureReport3 = await prisma.failureReport.create({
    data: {
      numero: 'AV-2026-003',
      descripcion: 'Transportadora tiene banda desalineada',
      tipo: 'reparación', // NFR-S10: reparación (para probar color coding)
      fotoUrl: null,
      equipoId: allEquipos[3].id, // Transportadora
      estado: 'NUEVO',
      reportadoPor: tecnico.id,
    },
  })

  // Crear un FailureReport en progreso (vinculado a WorkOrder existente)
  const failureReportInProgress = await prisma.failureReport.create({
    data: {
      numero: 'AV-2026-004',
      descripcion: 'Motor eléctrico sobrecalentado - requiere reemplazo',
      tipo: 'avería', // NFR-S10: avería
      fotoUrl: null,
      equipoId: allEquipos[0].id, // Prensa Hidráulica
      estado: 'EN_PROGRESO',
      reportadoPor: tecnico.id,
    },
  })

  // Vincular el FailureReport en progreso con la WorkOrder EN_PROGRESO
  await prisma.workOrder.update({
    where: { id: workOrder3.id },
    data: { failure_report_id: failureReportInProgress.id },
  })

  console.log('✅ Created sample operations:')
  console.log('   - 87 WorkOrders (distribuidos en 8 estados para Kanban testing)')
  console.log('     • PENDIENTE: 5 OTs')
  console.log('     • ASIGNADA: 15 OTs')
  console.log('     • EN_PROGRESO: 45 OTs (15 originales + 30 adicionales para E2E parallel testing)')
  console.log('     • PENDIENTE_REPUESTO: 4 OTs')
  console.log('     • PENDIENTE_PARADA: 3 OTs')
  console.log('     • REPARACION_EXTERNA: 3 OTs')
  console.log('     • COMPLETADA: 5 OTs')
  console.log('     • DESCARTADA: 2 OTs')
  console.log('   - 4 FailureReports (3 NUEVO, 1 EN_PROGRESO)')
  console.log('   - 26 Assignments (Técnicos asignados a OTs)')

  // ============================================
  // RESUMEN FINAL
  // ============================================
  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log('   - Users: 5 (admin, bsoto, tecnico, supervisor, new user)')
  console.log('   - Capabilities: 15')
  console.log('   - Tags: 5 (Operario, Técnico, Supervisor, Mantenimiento, Calidad)')
  console.log('   - Plantas: 2')
  console.log('   - Lineas: 5')
  console.log('   - Equipos: 10')
  console.log('   - Componentes: 8')
  console.log('   - Repuestos: 5')
  console.log('   - WorkOrders: 87')
  console.log('   - FailureReports: 4')
  console.log('\n🔐 Default credentials:')
  console.log('   Admin: admin@hiansa.com / admin123')
  console.log('   B. Soto: bsoto@hiansa.com / 1112BSC08')
  console.log('   Tecnico: tecnico@hiansa.com / tecnico123')
  console.log('   Supervisor: supervisor@hiansa.com / supervisor123')
  console.log('\n✅ Passwords hashed with bcrypt (10 rounds)')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

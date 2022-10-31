import { PrismaServiceType } from '@core/prisma/types/prisma';
import { hashSync } from 'bcrypt';

export async function createUsers(prismaClient: PrismaServiceType) {
  await prismaClient.session_status.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'ACTIVO',
      description: 'Session activa',
    },
  });

  await prismaClient.session_status.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'BANEADO',
      description: 'Session baneada',
    },
  });

  await prismaClient.$queryRaw`ALTER SEQUENCE session_status_id_seq restart 3`;

  await prismaClient.session_type.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'User',
      description: 'Session de usuarios',
    },
  });

  await prismaClient.$queryRaw`ALTER SEQUENCE session_type_id_seq restart 2`;

  await prismaClient.session_rol.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Super Admin',
      description: 'Rol super-usuario del sistema',
      typeId: 1,
    },
  });

  await prismaClient.session_rol.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Admin',
      description: 'Usuario administrador del sistema',
      typeId: 1,
    },
  });

  await prismaClient.session_rol.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Programador',
      description: 'Programador de puntos',
      typeId: 1,
    },
  });

  await prismaClient.session_rol.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      name: 'Vendedor',
      description: 'Vendedor de puntos',
      typeId: 1,
    },
  });

  await prismaClient.$queryRaw`ALTER SEQUENCE session_rol_id_seq restart 4`;

  await prismaClient.session.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      email: 'admin@mail.com',
      password: hashSync('12345678', 10),
      rolId: 1,
      typeId: 1,
    },
  });

  await prismaClient.$queryRaw`ALTER SEQUENCE session_id_seq restart 2`;

  await prismaClient.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'User',
      lastName: 'Admin',
      sessionId: 1,
      identityCard: '12345678',
      identityCardprefix: 'V',
      primaryPhone: '+5804140000000',
    },
  });
}

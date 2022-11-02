import { Prisma } from '@prisma/client';

import { FindManyArgs } from '@core/types/find-all.types';

export type FindManySessionRolesArgs =
  FindManyArgs<Prisma.session_rolFindManyArgs>;

export type FindManySessionStatusesArgs =
  FindManyArgs<Prisma.session_statusFindManyArgs>;

export type FindManyUsersArgs = FindManyArgs<Prisma.userFindManyArgs>;

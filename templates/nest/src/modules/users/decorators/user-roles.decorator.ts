import { SetMetadata } from '@nestjs/common';
import { UsersRole } from '../users.constants';

export const ROLES_KEY = 'role';
export const Roles = (...roles: UsersRole[]) => SetMetadata(ROLES_KEY, roles);

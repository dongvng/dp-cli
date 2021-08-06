import { UsersRole } from 'src/modules/users/users.constants';

export default interface IJwtPayload {
  email: string;
  role: UsersRole;
}

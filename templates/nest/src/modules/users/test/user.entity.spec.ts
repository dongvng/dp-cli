import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user.entity';

describe('User entity', () => {
  let user: UserEntity;

  beforeEach(() => {
    user = new UserEntity();
    user.password = 'testPassword';
    user.salt = 'testSalt';
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('validatePassword', () => {
    it('returns true as password is valid', async () => {
      const correctPassword = '123456';
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await user.validatePassword(correctPassword);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        correctPassword,
        user.password,
      );
      expect(result).toBe(true);
    });

    it('returns false as password is invalid', async () => {
      const wrongPassword = 'wrongPassword';
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await user.validatePassword(wrongPassword);
      expect(bcrypt.compare).toHaveBeenCalledWith(wrongPassword, user.password);
      expect(result).toEqual(false);
    });
  });
});

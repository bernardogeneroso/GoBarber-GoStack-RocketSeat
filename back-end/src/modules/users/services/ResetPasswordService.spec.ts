import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import ResetPasswordService from './ResetPasswordService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeHashProvider = new FakeHashProvider();
		resetPasswordService = new ResetPasswordService(fakeUsersRepository, fakeUserTokenRepository, fakeHashProvider);
	});

	it('should be able to reset the password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'Bernardo Generoso',
			email: 'bernardogeneroso@exemplo.com',
			password: 'old_password'
		});

    const { token } = await fakeUserTokenRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

		await resetPasswordService.execute({
			password: 'bernardogeneroso123',
			token
		});

		const updateUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('bernardogeneroso123')
		expect(updateUser?.password).toBe('bernardogeneroso123');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(resetPasswordService.execute({
      token: 'non-existing-token',
      password: 'bernardogeneroso123'
    })).rejects.toBeInstanceOf(AppError)
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const {token} = await fakeUserTokenRepository.generate('non-existing-user')

    await expect(resetPasswordService.execute({
      token,
      password: 'bernardogeneroso123'
    })).rejects.toBeInstanceOf(AppError)
  });

  it('should not be able to reset password if passed more then 2 hours', async () => {
		const user = await fakeUsersRepository.create({
			name: 'Bernardo Generoso',
			email: 'bernardogeneroso@exemplo.com',
			password: 'old_password'
		});

    const { token } = await fakeUserTokenRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date()

      return customDate.setHours(customDate.getHours() + 3)
    })

		await expect(resetPasswordService.execute({
			password: 'bernardogeneroso123',
			token
		})).rejects.toBeInstanceOf(AppError)

  });
});

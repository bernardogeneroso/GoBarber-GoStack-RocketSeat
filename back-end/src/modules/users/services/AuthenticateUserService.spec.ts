import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserServices';

import AppError from '@shared/errors/AppError';

describe('AuthenticateUser', () => {
	it('should be able to authenticate', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();

		const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
		const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

		const user = await createUser.execute({
			name: 'Bernaro Generoso',
			email: 'bernardogeneroso@exemplo.com',
			password: 'bernardogeneroso123'
		});

		const response = await authenticateUser.execute({
			email: 'bernardogeneroso@exemplo.com',
			password: 'bernardogeneroso123'
		});

		expect(response).toHaveProperty('token');
		expect(response.user).toEqual(user);
	});

	it('should not be able to authenticate with non existing user', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();

		const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

		await expect(
			authenticateUser.execute({
				email: 'bernardogeneroso@exemplo.com',
				password: 'bernardogeneroso123'
			})
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to authenticate with wrong password', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();

		const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
		const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

		await createUser.execute({
			name: 'Bernaro Generoso',
			email: 'bernardogeneroso@exemplo.com',
			password: 'bernardogeneroso123'
		});

		await expect(
			authenticateUser.execute({
				email: 'bernardogeneroso@exemplo.com',
				password: 'wrong-password'
			})
		).rejects.toBeInstanceOf(AppError);
	});
});

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserServices';

import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
	it('should be able to create a new user', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();

		const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

		const user = await createUser.execute({
			name: 'Bernardo Generoso',
			email: 'bernardogeneroso@exemplo.com',
			password: 'bernardogeneroso123'
		});

		expect(user).toHaveProperty('id');
	});

	it('should not be able to create a new user with same email from another', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();

		const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

		await createUser.execute({
			name: 'Bernardo Generoso',
			email: 'bernardogeneroso@exemplo.com',
			password: 'bernardogeneroso123'
		});

		await expect(
			createUser.execute({
				name: 'Bernardo Generoso',
				email: 'bernardogeneroso@exemplo.com',
				password: 'bernardogeneroso123'
			})
		).rejects.toBeInstanceOf(AppError);
	});
});

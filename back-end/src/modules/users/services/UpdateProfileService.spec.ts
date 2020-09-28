import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();

		updateProfileService = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
	});

	it('should be able to update profile', async () => {
		const user = await fakeUsersRepository.create({
			name: 'Bernardo Generoso',
			email: 'bernardogeneroso@mail.com',
			password: 'bernardogeneroso123'
		});

		const updatedUser = await updateProfileService.execute({
			user_id: user.id,
			name: 'John Friend',
			email: 'johnfrind@mail.com'
		});

		expect(updatedUser.name).toBe('John Friend');
		expect(updatedUser.email).toBe('johnfrind@mail.com');
	});

	it('should not be able to update the profile from non-existing user', async () => {
		expect(
			updateProfileService.execute({
				user_id: 'non-existing-user-id',
				name: 'Bernardo Generoso',
				email: 'bernardogeneroso@mail.com',
				password: 'bernardogeneroso123'
			})
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to change to another user email', async () => {
		await fakeUsersRepository.create({
			name: 'Bernardo Generoso',
			email: 'bernardogeneroso@mail.com',
			password: 'bernardogeneroso123'
		});

		const user = await fakeUsersRepository.create({
			name: 'John Crazy',
			email: 'johncrazy@mail.com',
			password: 'johncrazy123'
		});

		await expect(
			updateProfileService.execute({
				user_id: user.id,
				name: 'John Crazy',
				email: 'bernardogeneroso@mail.com'
			})
		).rejects.toBeInstanceOf(AppError);
	});

	it('should be able to update the password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'Bernardo Generoso',
			email: 'bernardogeneroso@mail.com',
			password: 'bernardogeneroso123'
		});

		const updatedUser = await updateProfileService.execute({
			user_id: user.id,
			name: 'John Friend',
			email: 'johnfrind@mail.com',
			old_password: '123123',
			password: '123123'
		});

		expect(updatedUser.password).toBe('123123');
	});

	it('should not be able to update the password without old password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'Bernardo Generoso',
			email: 'bernardogeneroso@mail.com',
			password: 'bernardogeneroso123'
		});

		await expect(
			updateProfileService.execute({
				user_id: user.id,
				name: 'John Friend',
				email: 'johnfrind@mail.com',
				password: '123123'
			})
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to update the password with wrong old password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'Bernardo Generoso',
			email: 'bernardogeneroso@mail.com',
			password: 'bernardogeneroso123'
		});

		await expect(
			updateProfileService.execute({
				user_id: user.id,
				name: 'John Friend',
				email: 'johnfrind@mail.com',
				old_password: 'wrong-old-password',
				password: '123123'
			})
		).rejects.toBeInstanceOf(AppError);
	});
});

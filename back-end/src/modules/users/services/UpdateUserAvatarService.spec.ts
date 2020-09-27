import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarServices from '@modules/users/services/UpdateUserAvatarService';

import AppError from '@shared/errors/AppError';

describe('UpdateUserAvatar', () => {
	it('should be able to create a new user and update avatar', async () => {
		const fakeStorageProvider = new FakeStorageProvider();
		const fakeUsersRepository = new FakeUsersRepository();

		const updateUserAvatar = new UpdateUserAvatarServices(fakeUsersRepository, fakeStorageProvider);

		const user = await fakeUsersRepository.create({
			name: 'Bernardo Generoso',
			email: 'bernardogeneroso@exemplo.com',
			password: 'bernardogeneroso123'
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'avatar.jpg'
		});

		expect(user.avatar).toBe('avatar.jpg');
	});

	it('should not be able to update avatar from non existing user', async () => {
		const fakeStorageProvider = new FakeStorageProvider();
		const fakeUsersRepository = new FakeUsersRepository();

		const updateUserAvatar = new UpdateUserAvatarServices(fakeUsersRepository, fakeStorageProvider);

		await expect(
			updateUserAvatar.execute({
				user_id: 'non-existing-user',
				avatarFilename: 'avatar.jpg'
			})
		).rejects.toBeInstanceOf(AppError);
	});

	it('should delete old avatar when updating new one', async () => {
		const fakeStorageProvider = new FakeStorageProvider();
		const fakeUsersRepository = new FakeUsersRepository();

		const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

		const updateUserAvatar = new UpdateUserAvatarServices(fakeUsersRepository, fakeStorageProvider);

		const user = await fakeUsersRepository.create({
			name: 'Bernardo Generoso',
			email: 'bernardogeneroso@exemplo.com',
			password: 'bernardogeneroso123'
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'avatar.jpg'
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'avatar2.jpg'
		});

		expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

		expect(user.avatar).toBe('avatar2.jpg');
	});
});

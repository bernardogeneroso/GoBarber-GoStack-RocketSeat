import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeDiskStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeDiskStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeDiskStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatarService', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeStorageProvider = new FakeDiskStorageProvider();
		updateUserAvatarService = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
	});

	it('updates user avatar', async () => {
		const avatarFileName = 'avatar.jpg';
		const user = await fakeUsersRepository.create({
			email: 'bernardogeneroso@email.com',
			name: 'Bernardo Generoso',
			password: '123456'
		});

		await updateUserAvatarService.execute({ user_id: user.id, avatarFileName });

		expect(user.avatar).toBe(avatarFileName);
	});

	it('does not update non existent user avatar', async () => {
		await expect(
			updateUserAvatarService.execute({
				user_id: 'non-existing-user',
				avatarFileName: 'avatar.jpg'
			})
		).rejects.toBeInstanceOf(AppError);
	});

	it('deletes old avatar before updating', async () => {
		const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

		const oldAvatarFileName = 'avatar.jpg';
		const newAvatarFileName = 'new-avatar.jpg';

		const user = await fakeUsersRepository.create({
			email: 'bernardogeneroso@email.com',
			name: 'Bernardo Generoso',
			password: '123456'
		});

		await updateUserAvatarService.execute({
			user_id: user.id,
			avatarFileName: oldAvatarFileName
		});
		await updateUserAvatarService.execute({
			user_id: user.id,
			avatarFileName: newAvatarFileName
		});

		expect(deleteFile).toHaveBeenCalledWith(oldAvatarFileName);
		expect(user.avatar).toBe(newAvatarFileName);
	});
});

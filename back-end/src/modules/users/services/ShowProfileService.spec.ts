import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('UpdateProfile', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();

		showProfileService = new ShowProfileService(fakeUsersRepository);
	});

	it('should be able to show the profile', async () => {
		const user = await fakeUsersRepository.create({
			name: 'Bernardo Generoso',
			email: 'bernardogeneroso@mail.com',
			password: 'bernardogeneroso123'
		});

		const profile = await showProfileService.execute({
			user_id: user.id
		});

		expect(profile.name).toBe('Bernardo Generoso');
		expect(profile.email).toBe('bernardogeneroso@mail.com');
	});

	it('should not be able to show the profile from non-existing user', async () => {
		expect(
			showProfileService.execute({
				user_id: 'non-existing-user-id'
			})
		).rejects.toBeInstanceOf(AppError);
	});
});

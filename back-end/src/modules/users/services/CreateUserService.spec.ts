import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUserService: CreateUserService;

describe('CreateUserService', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		fakeCacheProvider = new FakeCacheProvider();
		createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
	});

	it('creates a new user', async () => {
		const email = 'user@email.com';

		const user = await createUserService.execute({
			email,
			name: 'Test User',
			password: '123456'
		});

		expect(user).toHaveProperty('id');
		expect(user.email).toBe(email);
	});

	it('creates a new user with if email is already taken', async () => {
		const userParams = {
			email: 'user@email.com',
			name: 'Test User',
			password: '123456'
		};

		await createUserService.execute(userParams);
		await expect(createUserService.execute(userParams)).rejects.toBeInstanceOf(AppError);
	});
});

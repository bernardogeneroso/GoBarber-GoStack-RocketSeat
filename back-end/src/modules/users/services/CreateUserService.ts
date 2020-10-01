import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/models/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
	name: string;
	email: string;
	password: string;
}

@injectable()
class CreateUserService {
	constructor(
		@inject('UsersRepository') private usersRepository: IUsersRepository,
		@inject('HashProvider') private hashProvider: IHashProvider,
		@inject('CacheProvider') private cacheProvider: ICacheProvider
	) {}

	public async execute({ name, email, password }: IRequest): Promise<User> {
		const isAlreadyRegistered = await this.usersRepository.findByEmail(email);

		if (isAlreadyRegistered) throw new AppError('Email address already used.');

		const hashedPass = await this.hashProvider.generateHash(password);

		const user = await this.usersRepository.create({ name, email, password: hashedPass });

		await this.cacheProvider.invalidatePrefix(`providers-list`);

		return user;
	}
}

export default CreateUserService;

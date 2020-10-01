import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/models/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
	user_id: string;
	avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
	constructor(
		@inject('UsersRepository') private usersRepository: IUsersRepository,
		@inject('StorageProvider') private storageProvider: IStorageProvider
	) {}

	public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {
		const user = await this.usersRepository.findById(user_id);
		const errorMessage = 'Only authenticated users can change avatar';
		if (!user) throw new AppError(errorMessage, 401);

		if (user.avatar) {
			await this.storageProvider.deleteFile(user.avatar);
		}

		const fileName = await this.storageProvider.saveFile(avatarFileName);

		user.avatar = fileName;
		await this.usersRepository.save(user);

		return user;
	}
}

export default UpdateUserAvatarService;

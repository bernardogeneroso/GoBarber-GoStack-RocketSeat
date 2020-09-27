//import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';

import AppError from '@shared/errors/AppError';

import { injectable, inject } from 'tsyringe';

//import AppError from '@shared/errors/AppError';

interface IRequest {
	email: string;
}

@injectable()
class SendForgotPasswordEmailService {
	constructor(
		@inject('UsersRepository') private usersRepository: IUsersRepository,
		@inject('MailProvider') private mailProvider: IMailProvider,
		@inject('UserTokensRepository') private userTokenRepository: IUserTokenRepository
	) {}

	public async execute({ email }: IRequest): Promise<void> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new AppError('User dows not exists.');
		}

		await this.userTokenRepository.generate(user.id);

		this.mailProvider.sendMail(email, 'Pedido de recuperação de password recebido com successo!');
	}
}

export default SendForgotPasswordEmailService;

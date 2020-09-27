import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokenRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeMailProvider = new FakeMailProvider();
		fakeUserTokenRepository = new FakeUserTokenRepository();
		sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
			fakeUsersRepository,
			fakeMailProvider,
			fakeUserTokenRepository
		);
	});

	it('should be able to recover the password using the email', async () => {
		const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

		await fakeUsersRepository.create({
			name: 'Bernardo Generoso',
			email: 'bernardogeneroso@exemplo.com',
			password: 'bernardogeneroso123'
		});

		await sendForgotPasswordEmailService.execute({
			email: 'bernardogeneroso@exemplo.com'
		});

		expect(sendMail).toHaveBeenCalled();
	});

	it('should not be able to recover a non-existing user password', async () => {
		await expect(
			sendForgotPasswordEmailService.execute({
				email: 'bernardogeneroso@exemplo.com'
			})
		).rejects.toBeInstanceOf(AppError);
	});

	it('should generate a forgot password token', async () => {
		const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

		const user = await fakeUsersRepository.create({
			name: 'Bernardo Generoso',
			email: 'bernardogeneroso@exemplo.com',
			password: 'bernardogeneroso123'
		});

		await sendForgotPasswordEmailService.execute({
			email: 'bernardogeneroso@exemplo.com'
		});

		expect(generateToken).toHaveBeenCalledWith(user.id);
	});
});

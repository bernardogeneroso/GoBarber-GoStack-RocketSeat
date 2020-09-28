import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository'
import FakeUserTokensRepository from '@modules/users/repositories/fake/FakeUserTokensRepository'

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'

import AppError from '@shared/errors/AppError'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let fakeMailProvider: FakeMailProvider
let sendForgotPasswordEmailService: SendForgotPasswordEmailService

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()
    fakeMailProvider = new FakeMailProvider()
    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    )
  })

  it('recovers the password through email', async () => {
    const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail')
    const email = 'user@email.com'

    await fakeUsersRepository.create({
      email,
      name: 'Test User',
      password: '123456'
    })

    await sendForgotPasswordEmailService.execute({ email })

    expect(sendEmail).toHaveBeenCalled()
  })

  it('does not recover non existent user password', async () => {
    const email = 'non-existent-user@email.com'

    await expect(
      sendForgotPasswordEmailService.execute({ email })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('generates a password recovery token', async () => {
    const email = 'user@email.com'
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate')
    const user = await fakeUsersRepository.create({
      email: 'user@email.com',
      name: 'Test User',
      password: '123456'
    })

    await sendForgotPasswordEmailService.execute({ email })
    expect(generateToken).toHaveBeenCalledWith(user.id)
  })
})

import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository'
import FakeUserTokensRepository from '@modules/users/repositories/fake/FakeUserTokensRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'

import AppError from '@shared/errors/AppError'
import ResetPasswordService from './ResetPasswordService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let resetPasswordService: ResetPasswordService
let fakeHashProvider: FakeHashProvider

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()
    fakeHashProvider = new FakeHashProvider()
    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    )
  })

  it('resets password', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    const email = 'user@email.com'
    const newPassword = 'new pass'
    const user = await fakeUsersRepository.create({
      email,
      name: 'Test User',
      password: '123456'
    })

    const { token } = await fakeUserTokensRepository.generate(user.id)
    await resetPasswordService.execute({ token, password: newPassword })

    const updatedUser = await fakeUsersRepository.findById(user.id)

    expect(generateHash).toHaveBeenCalledWith(newPassword)
    expect(updatedUser?.password).toBe(newPassword)
  })

  it('does not reset password for non existent token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existent-token',
        password: 'password'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('does not reset password for non existent user', async () => {
    const { token } = await fakeUserTokensRepository.generate('non-existent-id')

    await expect(
      resetPasswordService.execute({
        token,
        password: 'password'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('does not reset password after two hours', async () => {
    const email = 'user@email.com'
    const newPassword = 'new pass'
    const user = await fakeUsersRepository.create({
      email,
      name: 'Test User',
      password: '123456'
    })

    const { token } = await fakeUserTokensRepository.generate(user.id)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date()
      return customDate.setHours(customDate.getHours() + 3)
    })

    await expect(
      resetPasswordService.execute({
        token,
        password: newPassword
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})

import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import AppError from '@shared/errors/AppError'
import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let createUserService: CreateUserService
let authenticateUserService: AuthenticateUserService

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
  })
  it('authenticates user', async () => {
    const params = {
      name: 'Test User',
      email: 'user@email.com',
      password: '123456'
    }

    const user = await createUserService.execute(params)

    const response = await authenticateUserService.execute({
      email: params.email,
      password: params.password
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(user)
  })

  it('does not authenticate non existent user', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'nonexistent@email.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('does not authenticate user when password do not match', async () => {
    const params = {
      name: 'Test User',
      email: 'user@email.com',
      password: '123456'
    }

    await createUserService.execute(params)

    await expect(
      authenticateUserService.execute({
        email: params.email,
        password: 'abcdef'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})

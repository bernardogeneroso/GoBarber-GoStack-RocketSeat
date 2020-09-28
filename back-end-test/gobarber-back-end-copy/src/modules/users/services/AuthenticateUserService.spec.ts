import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import AppError from '@shared/errors/AppError'
import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

describe('AuthenticateUserService', () => {
  it('authenticates user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
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
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()
    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )

    expect(
      authenticateUserService.execute({
        email: 'nonexistent@email.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('does not authenticate user when password do not match', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
    const params = {
      name: 'Test User',
      email: 'user@email.com',
      password: '123456'
    }

    await createUserService.execute(params)

    expect(
      authenticateUserService.execute({
        email: params.email,
        password: 'abcdef'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})

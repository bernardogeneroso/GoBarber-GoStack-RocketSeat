import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import AppError from '@shared/errors/AppError'
import CreateUserService from './CreateUserService'

describe('CreateUserService', () => {
  it('creates a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
    const email = 'user@email.com'

    const user = await createUserService.execute({
      email,
      name: 'Test User',
      password: '123456'
    })

    expect(user).toHaveProperty('id')
    expect(user.email).toBe(email)
  })

  it('creates a new user with if email is already taken', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
    const userParams = {
      email: 'user@email.com',
      name: 'Test User',
      password: '123456'
    }

    await createUserService.execute(userParams)
    expect(createUserService.execute(userParams)).rejects.toBeInstanceOf(
      AppError
    )
  })
})

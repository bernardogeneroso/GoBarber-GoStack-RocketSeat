import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import AppError from '@shared/errors/AppError'
import UpdateProfileService from './UpdateProfileService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateProviderService: UpdateProfileService

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    updateProviderService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    )
  })

  it('updates user profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'user@email.com',
      name: 'Test User',
      password: '123456'
    })

    const params = {
      user_id: user.id,
      name: 'Edited User',
      email: 'edited_email@email.com'
    }

    const updatedUser = await updateProviderService.execute(params)

    expect(updatedUser.name).toBe(params.name)
    expect(updatedUser.email).toBe(params.email)
  })

  it('does not update user profile if new email is already taken', async () => {
    const user = await fakeUsersRepository.create({
      email: 'user@email.com',
      name: 'Test User',
      password: '123456'
    })

    const anotherUser = await fakeUsersRepository.create({
      email: 'another_user@email.com',
      name: 'Another Test User',
      password: '123456'
    })

    const params = {
      user_id: anotherUser.id,
      name: 'Edited User',
      email: user.email
    }

    await expect(updateProviderService.execute(params)).rejects.toBeInstanceOf(
      AppError
    )
  })

  it('updates user password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'user@email.com',
      name: 'Test User',
      password: '123456'
    })

    const params = {
      user_id: user.id,
      name: 'Edited User',
      email: 'user@email.com',
      password: 'new password',
      old_password: '123456'
    }

    const updatedUser = await updateProviderService.execute(params)
    expect(updatedUser.password).toBe(params.password)
  })

  it('does not update user password without old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'user@email.com',
      name: 'Test User',
      password: '123456'
    })

    const params = {
      user_id: user.id,
      name: 'Edited User',
      email: 'user@email.com',
      password: 'new password'
    }

    await expect(updateProviderService.execute(params)).rejects.toBeInstanceOf(
      AppError
    )
  })

  it('does not update user password when old password is wrong', async () => {
    const user = await fakeUsersRepository.create({
      email: 'user@email.com',
      name: 'Test User',
      password: '123456'
    })

    const params = {
      user_id: user.id,
      name: 'Edited User',
      email: 'user@email.com',
      password: 'new password',
      old_password: 'wrong old password'
    }

    await expect(updateProviderService.execute(params)).rejects.toBeInstanceOf(
      AppError
    )
  })

  it('does not update profile for non existent user id', async () => {
    await expect(
      updateProviderService.execute({
        user_id: 'non-existent-id',
        name: 'Edited User',
        email: 'user@email.com'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})

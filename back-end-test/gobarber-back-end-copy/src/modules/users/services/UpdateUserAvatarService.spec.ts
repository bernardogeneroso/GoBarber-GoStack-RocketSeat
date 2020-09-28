import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository'
import FakeDiskStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeDiskStorageProvider'
import AppError from '@shared/errors/AppError'
import UpdateUserAvatarService from './UpdateUserAvatarService'

describe('UpdateUserAvatarService', () => {
  it('updates user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeStorageProvider = new FakeDiskStorageProvider()
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    )
    const avatarFileName = 'avatar.jpg'
    const user = await fakeUsersRepository.create({
      email: 'user@email.com',
      name: 'Test User',
      password: '123456'
    })

    await updateUserAvatarService.execute({ user_id: user.id, avatarFileName })

    expect(user.avatar).toBe(avatarFileName)
  })

  it('does not update non existent user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeStorageProvider = new FakeDiskStorageProvider()
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    )

    expect(
      updateUserAvatarService.execute({
        user_id: 'non-existing-user',
        avatarFileName: 'avatar.jpg'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('deletes old avatar before updating', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeStorageProvider = new FakeDiskStorageProvider()

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    )
    const oldAvatarFileName = 'avatar.jpg'
    const newAvatarFileName = 'new-avatar.jpg'

    const user = await fakeUsersRepository.create({
      email: 'user@email.com',
      name: 'Test User',
      password: '123456'
    })

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: oldAvatarFileName
    })
    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: newAvatarFileName
    })

    expect(deleteFile).toHaveBeenCalledWith(oldAvatarFileName)
    expect(user.avatar).toBe(newAvatarFileName)
  })
})

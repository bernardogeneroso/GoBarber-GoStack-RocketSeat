import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository'

import AppError from '@shared/errors/AppError'
import ShowProfileService from './ShowProfileService'

let fakeUsersRepository: FakeUsersRepository
let showProfileService: ShowProfileService

describe('ShowProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    showProfileService = new ShowProfileService(fakeUsersRepository)
  })

  it('shows user profile', async () => {
    const params = {
      email: 'user@email.com',
      name: 'Test User',
      password: '123456'
    }

    const user = await fakeUsersRepository.create(params)
    const profile = await showProfileService.execute({ user_id: user.id })

    expect(profile.name).toBe(params.name)
    expect(profile.email).toBe(params.email)
  })

  it('does not show profile for non existent id', async () => {
    await expect(
      showProfileService.execute({ user_id: 'non-existent-id' })
    ).rejects.toBeInstanceOf(AppError)
  })
})

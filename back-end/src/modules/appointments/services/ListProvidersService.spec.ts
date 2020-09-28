import FakeUsersRepository from '@modules/users/repositories/fake/FakeUsersRepository'
import ListProvidersService from './ListProvidersService'

let fakeUsersRepository: FakeUsersRepository
let listProfilesService: ListProvidersService

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    listProfilesService = new ListProvidersService(fakeUsersRepository)
  })

  it('lists providers', async () => {
    const userParams = {
      email: 'user@email.com',
      name: 'Test User',
      password: '123456'
    }
    const otherUserParams = {
      email: 'other_user@email.com',
      name: 'Other Test User',
      password: '123456'
    }
    const loggedUserParams = {
      email: 'other_user@email.com',
      name: 'Other Test User',
      password: '123456'
    }

    const user = await fakeUsersRepository.create(userParams)
    const otherUser = await fakeUsersRepository.create(otherUserParams)
    const loggedUser = await fakeUsersRepository.create(loggedUserParams)
    const providers = await listProfilesService.execute({
      user_id: loggedUser.id
    })

    expect(providers).toEqual([user, otherUser])
  })
})

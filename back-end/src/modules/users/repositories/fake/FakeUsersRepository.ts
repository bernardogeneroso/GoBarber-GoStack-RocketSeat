import { uuid } from 'uuidv4'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'

import User from '@modules/users/infra/typeorm//models/User'

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = []

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id)
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email)
  }

  public async findAllProviders(current_user_id?: string): Promise<User[]> {
    return current_user_id
      ? this.users.filter(user => user.id !== current_user_id)
      : this.users
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User()
    Object.assign(user, { id: uuid() }, userData)

    this.users.push(user)
    return user
  }

  public save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(findUser => findUser.id === user.id)
    this.users[userIndex] = user

    return Promise.resolve(user)
  }
}

export default FakeUsersRepository

import User from '@modules/users/infra/typeorm/models/User'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'

interface IUsersRepository {
  findById(id: string): Promise<User | undefined>
  findByEmail(email: string): Promise<User | undefined>
  findAllProviders(current_user_id?: string): Promise<User[]>
  create(data: ICreateUserDTO): Promise<User>
  save(user: User): Promise<User>
}

export default IUsersRepository

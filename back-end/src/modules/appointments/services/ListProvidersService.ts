import { injectable, inject } from 'tsyringe'

import User from '@modules/users/infra/typeorm/models/User'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'

interface IRequest {
  user_id: string
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    return this.usersRepository.findAllProviders(user_id)
  }
}

export default ListProvidersService

import { injectable, inject } from 'tsyringe'
import { differenceInHours } from 'date-fns'

import AppError from '@shared/errors/AppError'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository'
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'

interface IRequest {
  token: string
  password: string
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token)
    if (!userToken) throw new AppError('Token not found')

    const user = await this.usersRepository.findById(userToken.user_id)
    if (!user) throw new AppError('User not found')

    const tokenCreatedAt = userToken.created_at
    const now = new Date(Date.now())
    const hasTokenExpired = differenceInHours(now, tokenCreatedAt) > 2
    if (hasTokenExpired) throw new AppError('Token has expired')

    user.password = await this.hashProvider.generateHash(password)
    await this.usersRepository.save(user)
  }
}

export default ResetPasswordService

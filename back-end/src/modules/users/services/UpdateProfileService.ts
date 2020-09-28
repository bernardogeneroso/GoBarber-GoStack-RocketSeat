import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import User from '@modules/users/infra/typeorm/models/User'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'

interface IRequest {
  user_id: string
  name: string
  email: string
  password?: string
  old_password?: string
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)
    if (!user) throw new AppError(errors.user)

    const userWithEmail = await this.usersRepository.findByEmail(email)
    const isEmailTaken = userWithEmail && userWithEmail.id !== user_id
    if (isEmailTaken) throw new AppError(user.email)

    if (password && !old_password) throw new AppError(errors.password.missing)

    if (password && old_password) {
      const isMatch = await this.hashProvider.compareHash(
        old_password,
        user.password
      )
      if (!isMatch) throw new AppError(errors.password.incorrect)

      user.password = await this.hashProvider.generateHash(password)
    }

    Object.assign(user, { name, email })
    await this.usersRepository.save(user)
    return user
  }
}

const errors = {
  user: 'User not found',
  email: 'Email is already taken',
  password: {
    missing: 'You need to inform the old password to set the new one',
    incorrect: 'Incorrect current password'
  }
}

export default UpdateProfileService

import { uuid } from 'uuidv4'

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository'
import UserToken from '@modules/users/infra/typeorm/models/UserToken'

class FakeUserTokensRepository implements IUserTokensRepository {
  private tokens: UserToken[] = []

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken()
    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date()
    })

    this.tokens.push(userToken)

    return userToken
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    return this.tokens.find(tokenItem => tokenItem.token === token)
  }
}

export default FakeUserTokensRepository

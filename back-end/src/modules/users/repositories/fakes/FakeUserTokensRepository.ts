import { uuid } from 'uuidv4';

import IUserTokensRepository from '@modules/users/repositories/IUserTokenRepository';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import User from '@modules/users/infra/typeorm/entities/User';

class FakeUserTokenRepository implements IUserTokensRepository {
	private userTokens: UserToken[] = [];

	public async generate(user_id: string): Promise<UserToken> {
		const userToken = new UserToken();

		const dateNow = new Date();

		Object.assign(userToken, {
			id: uuid(),
			token: uuid(),
			user_id,
			created_at: dateNow,
			updated_at: dateNow
		});

		this.userTokens.push(userToken);

		return userToken;
	}

	public async findByToken(token: string): Promise<UserToken | undefined> {
		const userToken = this.userTokens.find((findToken) => findToken.token === token);

		return userToken;
	}
}

export default FakeUserTokenRepository;

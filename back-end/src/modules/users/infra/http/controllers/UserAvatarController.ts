import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

class UserAvatarController {
	public async update(request: Request, response: Response): Promise<Response> {
		const updateUserAvatarService = container.resolve(UpdateUserAvatarService);

		const user = await updateUserAvatarService.execute({
			user_id: request.user.id,
			avatarFileName: request.file.filename
		});

		delete user.password;

		return response.json(user);
	}
}

export default UserAvatarController;

import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

class ProviderAppointmentsController {
	public async index(request: Request, response: Response): Promise<Response> {
		const provider_id = request.user.id;
		const { day, month, year } = request.query;

		const listProviderAppointmentsService = container.resolve(ListProviderAppointmentsService);

		const appointments = await listProviderAppointmentsService.execute({
			provider_id,
			month: Number(month),
			year: Number(year),
			day: Number(day)
		});

		return response.json(classToClass(appointments));
	}
}

export default ProviderAppointmentsController;

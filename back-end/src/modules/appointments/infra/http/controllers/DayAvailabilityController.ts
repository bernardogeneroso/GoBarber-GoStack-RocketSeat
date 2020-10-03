import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListDayAvailabilityService from '@modules/appointments/services/ListDayAvailabilityService';

class DayAvailabilityController {
	public async index(request: Request, response: Response): Promise<Response> {
		const listDayAvailabilityService = container.resolve(ListDayAvailabilityService);

		const { provider_id } = request.params;
		const { month, year, day } = request.query;

		const availability = await listDayAvailabilityService.execute({
			provider_id,
			month: Number(month),
			year: Number(year),
			day: Number(day)
		});

		return response.json(availability);
	}
}

export default DayAvailabilityController;

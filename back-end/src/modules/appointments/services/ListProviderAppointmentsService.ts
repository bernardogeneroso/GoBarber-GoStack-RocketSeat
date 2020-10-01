import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/models/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
	provider_id: string;
	month: number;
	year: number;
	day: number;
}

@injectable()
class ListProviderAppointmentsService {
	constructor(
		@inject('AppointmentsRepository') private appointmentsRepository: IAppointmentsRepository,
		@inject('CacheProvider') private cacheProvider: ICacheProvider
	) {}

	public async execute({ provider_id, month, year, day }: IRequest): Promise<Appointment[]> {
		const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

		let appointments = await this.cacheProvider.recover<Appointment[]>(cacheKey);

		if (!appointments) {
			appointments = await this.appointmentsRepository.findAllInDay({
				provider_id,
				month,
				year,
				day
			});

			await this.cacheProvider.save(cacheKey, appointments);
		}

		return appointments;
	}
}

export default ListProviderAppointmentsService;

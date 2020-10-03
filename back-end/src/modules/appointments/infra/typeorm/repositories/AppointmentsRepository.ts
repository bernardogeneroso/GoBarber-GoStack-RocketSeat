import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm//models/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthDTO from '@modules/appointments/dtos/IFindAllInMonthDTO';
import IFindAllInDayDTO from '@modules/appointments/dtos/IFindAllInDayDTO';

class AppointmentsRepository implements IAppointmentsRepository {
	private ormRepository: Repository<Appointment>;

	constructor() {
		this.ormRepository = getRepository(Appointment);
	}

	public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
		return this.ormRepository.findOne({ where: { date, provider_id } });
	}

	public async findAllInMonth({ provider_id, month, year }: IFindAllInMonthDTO): Promise<Appointment[]> {
		const parsedMonth = String(month).padStart(2, '0');

		return this.ormRepository.find({
			where: {
				provider_id,
				date: Raw((dateFieldName) => `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`)
			}
		});
	}

	public async findAllInDay({ provider_id, month, year, day }: IFindAllInDayDTO): Promise<Appointment[]> {
		const parsedDay = String(day).padStart(2, '0');
		const parsedMonth = String(month).padStart(2, '0');

		return this.ormRepository.find({
			where: {
				provider_id,
				date: Raw(
					(dateFieldName) => `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
				)
			},
			relations: [ 'user' ]
		});
	}

	public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
		const appointment = this.ormRepository.create({
			provider_id,
			user_id,
			date
		});

		await this.ormRepository.save(appointment);
		return appointment;
	}
}

export default AppointmentsRepository;

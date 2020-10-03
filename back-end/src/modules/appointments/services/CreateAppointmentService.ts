import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm//models/Appointment';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
	provider_id: string;
	user_id: string;
	date: Date;
}

@injectable()
class CreateAppointmentService {
	constructor(
		@inject('AppointmentsRepository') private appointmentRepository: IAppointmentsRepository,
		@inject('NotificationsRepository') private notificationsRepository: INotificationsRepository,
		@inject('CacheProvider') private cacheProvider: ICacheProvider
	) {}

	public async execute({ provider_id, user_id, date }: IRequest): Promise<Appointment> {
		const appointmentDate = startOfHour(date);
		const isPastDate = isBefore(appointmentDate, Date.now());
		const isBusinessHours = getHours(appointmentDate) >= 8 && getHours(appointmentDate) <= 17;

		if (isPastDate) throw new AppError(errors.pastDate);

		if (provider_id === user_id) throw new AppError(errors.invalidUserId);

		if (!isBusinessHours) throw new AppError(errors.businessHours);

		const findAppointment = await this.appointmentRepository.findByDate(appointmentDate, provider_id);

		if (findAppointment) throw new AppError(errors.alreadyBooked);

		const appointment = await this.appointmentRepository.create({
			provider_id,
			user_id,
			date: appointmentDate
		});

		const formattedDate = format(appointmentDate, "yyyy/MM/dd 'at' HH:mm");

		await this.notificationsRepository.create({
			recipient_id: provider_id,
			content: `New appointment scheduled on ${formattedDate}`
		});

		await this.cacheProvider.invalidate(
			`provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`
		);

		return appointment;
	}
}

const errors = {
	pastDate: 'You cannot create an appointment on a past date',
	alreadyBooked: 'This appointment is already booked',
	invalidUserId: 'You cannot create an appointment with yourself',
	businessHours: 'You can only create appointments between 8AM and 5PM'
};

export default CreateAppointmentService;

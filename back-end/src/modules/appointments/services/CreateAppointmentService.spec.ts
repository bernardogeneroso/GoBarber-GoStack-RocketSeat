import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
	it('should be able to create a new appointment', async () => {
		const fakeAppointmentRepository = new FakeAppointmentRepository();
		const createAppointment = new CreateAppointmentService(fakeAppointmentRepository);

		const appointment = await createAppointment.execute({
			date: new Date(),
			provider_id: '123123'
		});

		expect(appointment).toHaveProperty('id');
		expect(appointment.provider_id).toBe('123123');
	});

	it('should not be able to create two appointment on the same time', async () => {
		const fakeAppointmentRepository = new FakeAppointmentRepository();
		const createAppointment = new CreateAppointmentService(fakeAppointmentRepository);

		const appointmentDate = new Date(2020, 4, 10, 11);

		await createAppointment.execute({
			date: appointmentDate,
			provider_id: '123123'
		});

		await expect(
			createAppointment.execute({
				date: appointmentDate,
				provider_id: '123123'
			})
		).rejects.toBeInstanceOf(AppError);
	});
});

import FakeAppointmentsRepository from '@modules/appointments/repositories/fake/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointmentService', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		createAppointmentService = new CreateAppointmentService(fakeAppointmentsRepository);
	});

	it('creates a new appointment', async () => {
		const appointment = await createAppointmentService.execute({
			date: new Date(),
			provider_id: '123456789'
		});

		expect(appointment).toHaveProperty('id');
		expect(appointment.provider_id).toBe('123456789');
	});

	it('creates does not create two appointments on the same time', async () => {
		const appointmentDate = new Date();
		const appointmentParams = { date: appointmentDate, provider_id: '123456789' };
		await createAppointmentService.execute(appointmentParams);

		expect(createAppointmentService.execute(appointmentParams)).rejects.toBeInstanceOf(AppError);
	});
});

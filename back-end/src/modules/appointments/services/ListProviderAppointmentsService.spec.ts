import FakeAppointmentsRepository from '@modules/appointments/repositories/fake/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointmentsService', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		fakeCacheProvider = new FakeCacheProvider();
		listProviderAppointmentsService = new ListProviderAppointmentsService(
			fakeAppointmentsRepository,
			fakeCacheProvider
		);
	});

	it('lists provider appointments in a day', async () => {
		const appointmentsParams = [
			{
				provider_id: '1',
				user_id: '7',
				date: new Date(2020, 4, 20, 14, 0, 0)
			},
			{
				provider_id: '1',
				user_id: '7',
				date: new Date(2020, 4, 20, 15, 0, 0)
			}
		];

		const dayAppointments = appointmentsParams.map((params) => {
			return Promise.resolve(fakeAppointmentsRepository.create(params));
		});

		const appointments = await Promise.all(dayAppointments);

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 20, 11).getTime();
		});

		const providerAppointments = await listProviderAppointmentsService.execute({
			provider_id: '1',
			month: 5,
			year: 2020,
			day: 20
		});

		expect(providerAppointments).toEqual(appointments);
	});
});

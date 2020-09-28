import FakeAppointmentsRepository from '@modules/appointments/repositories/fake/FakeAppointmentsRepository'
import ListDayAvailabilityService from './ListDayAvailabilityService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listDayAvailabilityService: ListDayAvailabilityService

describe('ListDayAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    listDayAvailabilityService = new ListDayAvailabilityService(
      fakeAppointmentsRepository
    )
  })

  it('lists month availability', async () => {
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
    ]

    const dayAppointments = appointmentsParams.map(params => {
      return Promise.resolve(fakeAppointmentsRepository.create(params))
    })

    await Promise.all(dayAppointments)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime()
    })

    const availability = await listDayAvailabilityService.execute({
      provider_id: '1',
      month: 5,
      year: 2020,
      day: 20
    })

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: true },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
        { hour: 17, available: true }
      ])
    )
  })
})

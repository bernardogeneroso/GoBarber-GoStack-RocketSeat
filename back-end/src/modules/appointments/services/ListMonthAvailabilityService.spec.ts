import FakeAppointmentsRepository from '@modules/appointments/repositories/fake/FakeAppointmentsRepository'
import ListMonthAvailabilityService from './ListMonthAvailabilityService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listMonthAvailabilityService: ListMonthAvailabilityService

describe('ListMonthAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    listMonthAvailabilityService = new ListMonthAvailabilityService(
      fakeAppointmentsRepository
    )
  })

  it('lists month availability', async () => {
    const appointmentHours = Array.from(Array(10)).map((_, i) => i + 8)
    const dayAppointments = appointmentHours.map(hour => {
      const appointmentParams = {
        provider_id: '1',
        user_id: '7',
        date: new Date(2020, 4, 20, hour, 0, 0)
      }

      return Promise.resolve(
        fakeAppointmentsRepository.create(appointmentParams)
      )
    })

    await Promise.all(dayAppointments)

    const appointmentParams = {
      provider_id: '1',
      user_id: '7',
      date: new Date(2020, 4, 21, 10, 0, 0)
    }

    await fakeAppointmentsRepository.create(appointmentParams)
    const availability = await listMonthAvailabilityService.execute({
      provider_id: '1',
      month: 5,
      year: 2020
    })

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true }
      ])
    )
  })
})

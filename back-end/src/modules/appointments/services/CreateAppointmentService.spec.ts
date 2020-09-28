import FakeAppointmentsRepository from '@modules/appointments/repositories/fake/FakeAppointmentsRepository'
import AppError from '@shared/errors/AppError'
import CreateAppointmentService from './CreateAppointmentService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let createAppointmentService: CreateAppointmentService

describe('CreateAppointmentService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository
    )
  })

  it('creates a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const userId = '7654321'
    const providerId = '1234567'
    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: userId,
      provider_id: providerId
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe(providerId)
  })

  it('does not create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const appointmentDate = new Date(2020, 4, 10, 13)
    const appointmentParams = {
      date: appointmentDate,
      provider_id: '1234567',
      user_id: '7654321'
    }
    await createAppointmentService.execute(appointmentParams)

    await expect(
      createAppointmentService.execute(appointmentParams)
    ).rejects.toBeInstanceOf(AppError)
  })

  it('does not create an appointment in the past', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })
    const appointmentDate = new Date(2020, 4, 10, 10)
    const appointmentParams = {
      date: appointmentDate,
      provider_id: '1234567',
      user_id: '7654321'
    }

    await expect(
      createAppointmentService.execute(appointmentParams)
    ).rejects.toBeInstanceOf(AppError)
  })

  it('does not create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const appointmentDate = new Date(2020, 4, 16, 20)
    const providerId = '1234567'
    const appointmentParams = {
      date: appointmentDate,
      provider_id: providerId,
      user_id: providerId
    }

    await expect(
      createAppointmentService.execute(appointmentParams)
    ).rejects.toBeInstanceOf(AppError)
  })

  it('does not create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const beforeEight = new Date(2020, 4, 11, 7)
    const afterFive = new Date(2020, 4, 11, 18)

    await expect(
      createAppointmentService.execute({
        date: beforeEight,
        provider_id: 'provider-id',
        user_id: 'user-id'
      })
    ).rejects.toBeInstanceOf(AppError)

    await expect(
      createAppointmentService.execute({
        date: afterFive,
        provider_id: 'provider-id',
        user_id: 'user-id'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})

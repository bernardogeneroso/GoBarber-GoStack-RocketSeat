import { uuid } from 'uuidv4'
import { isEqual, getMonth, getYear, getDate } from 'date-fns'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import Appointment from '@modules/appointments/infra/typeorm//models/Appointment'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthDTO from '@modules/appointments/dtos/IFindAllInMonthDTO'
import IFindAllInDayDTO from '@modules/appointments/dtos/IFindAllInDayDTO'

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = []

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    return this.appointments.find(appointment =>
      isEqual(appointment.date, date)
    )
  }

  public async findAllInMonth({
    provider_id,
    month,
    year
  }: IFindAllInMonthDTO): Promise<Appointment[]> {
    return this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      )
    })
  }

  public async findAllInDay({
    provider_id,
    month,
    year,
    day
  }: IFindAllInDayDTO): Promise<Appointment[]> {
    return this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      )
    })
  }

  public async create({
    provider_id,
    user_id,
    date
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment()

    Object.assign(appointment, { id: uuid(), date, provider_id, user_id })

    this.appointments.push(appointment)
    return appointment
  }
}

export default FakeAppointmentsRepository

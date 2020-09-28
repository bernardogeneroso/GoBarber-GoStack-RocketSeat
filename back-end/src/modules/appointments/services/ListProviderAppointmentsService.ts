import { injectable, inject } from 'tsyringe'

import Appointment from '@modules/appointments/infra/typeorm/models/Appointment'
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  month: number
  year: number
  day: number
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day
  }: IRequest): Promise<Appointment[]> {
    return this.appointmentsRepository.findAllInDay({
      provider_id,
      month,
      year,
      day
    })
  }
}

export default ListProviderAppointmentsService

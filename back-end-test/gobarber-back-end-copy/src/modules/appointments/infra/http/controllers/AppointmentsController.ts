import { Request, Response } from 'express'
import { parseISO } from 'date-fns'
import { container } from 'tsyringe'

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'

class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createAppointmentService = container.resolve(CreateAppointmentService)
    const { provider_id, date } = request.body
    const parsedDate = parseISO(date)

    const appointment = await createAppointmentService.execute({
      provider_id,
      date: parsedDate
    })

    return response.json(appointment)
  }
}

export default AppointmentsController

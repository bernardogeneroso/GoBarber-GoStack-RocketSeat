import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ListMonthAvailabilityService from '@modules/appointments/services/ListMonthAvailabilityService'

class MonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listMonthAvailabilityService = container.resolve(
      ListMonthAvailabilityService
    )

    const { provider_id } = request.params
    const { month, year } = request.body
    const availability = await listMonthAvailabilityService.execute({
      provider_id,
      month,
      year
    })

    return response.json(availability)
  }
}

export default MonthAvailabilityController

import { Router } from 'express'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import ProvidersController from '../controllers/ProvidersController'
import MonthAvailabilityController from '../controllers/MonthAvailabilityController'
import DayAvailabilityController from '../controllers/DayAvailabilityController'

const providersRouter = Router()
const providersController = new ProvidersController()
const monthAvailabilityController = new MonthAvailabilityController()
const dayAvailabilityController = new DayAvailabilityController()

providersRouter.use(ensureAuthenticated)

providersRouter.get('/', providersController.index)
providersRouter.get(
  '/:provider_id/day-availability',
  dayAvailabilityController.index
)
providersRouter.get(
  '/:provider_id/month-availability',
  monthAvailabilityController.index
)

export default providersRouter

import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import ProfilesController from '../controllers/ProfilesController'

const profilesRouter = Router()
const profilesController = new ProfilesController()

profilesRouter.use(ensureAuthenticated)

profilesRouter.get('/', profilesController.show)
profilesRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password'))
    }
  }),
  profilesController.update
)

export default profilesRouter

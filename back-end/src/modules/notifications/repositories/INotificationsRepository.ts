import Notification from '@modules/notifications/infra/typeorm/schemas/Notification'
import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO'

interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>
}

export default INotificationsRepository

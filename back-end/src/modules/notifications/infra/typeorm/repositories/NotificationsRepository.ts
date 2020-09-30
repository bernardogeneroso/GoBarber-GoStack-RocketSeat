import { getMongoRepository, MongoRepository } from 'typeorm'

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification'
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO'

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo')
  }

  public async create({
    recipient_id,
    content
  }: ICreateNotificationDTO): Promise<Notification> {
    const natification = this.ormRepository.create({ recipient_id, content })

    return this.ormRepository.save(natification)
  }
}

export default NotificationsRepository

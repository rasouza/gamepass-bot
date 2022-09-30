import { provide } from 'inversify-binding-decorators'

import { DB } from './base'
import Subscription from '../../../domain/Subscription'

@provide(SubscriptionDB)
export class SubscriptionDB extends DB<Subscription> {
  name = 'subscriptions'

  public async getByType(type: string) {
    const { data, error } = await this.getTable().select('*').eq('type', type)
    if (error) this.logger.error(error)

    return data ?? []
  }
}
